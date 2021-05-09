import shortid from 'shortid';
import editJsonFile from 'edit-json-file';
import {
  IntrospectionQuery,
  findBreakingChanges,
  findDangerousChanges,
  GraphQLSchema,
} from 'graphql';
import { SchemasMappingsInput } from '@grogqli/schema';
import fs from 'fs';
import glob from 'glob';

import { buildGraphQLSchemaFromIntrospectionQuery } from '../utils/buildGraphQLSchemaFromIntrospectionQuery';

import { add as createSchemaMapping } from './schemaMapping';
import {
  buildGraphQLSchema as buildGraphQLSchemaFromTemporarySchemaRecording,
  get as getTemporarySchemaRecordingFile,
} from './tempSchemaRecording';

import {
  doesFileExist,
  mapObjectToJsonFile,
  SCHEMA_FILE_VERSION,
  getSchemaRecordingFilePath,
  getSchemasFolderPath,
} from './';

export const NEW_SCHEMA_NAME = 'NEW';

export type SchemaRecordingFile = SchemaRecordingFileVersion1;
interface SchemaRecordingFileVersion1 {
  version: 1;
  id: string;
  name: string;
  hash: string;
  introspectionQuery: IntrospectionQuery;
}

const compareHashes = async (
  schemaId: string,
  hash: string
): Promise<boolean> => {
  const schemaRecordingFile = await getSchemaRecordingFile(schemaId);
  if (schemaRecordingFile === null) {
    throw new Error(`
      Error while comparing schema hashes:
      Cannot find a file for a schema recording associated with the following schemaId:${schemaId}
    `);
  }

  return schemaRecordingFile.hash === hash;
};

export const getSchemaRecordingFile = async (
  schemaId: string
): Promise<SchemaRecordingFile | null> => {
  const schemaRecordingFilePath = await getSchemaRecordingFilePath(schemaId);

  let schemaRecordingFile: SchemaRecordingFile | null;
  try {
    schemaRecordingFile = JSON.parse(
      await fs.promises.readFile(schemaRecordingFilePath, 'utf8')
    );
  } catch (error) {
    console.error(
      `Could not open schemaRecordingFile with schemaId:${schemaId}`,
      { error }
    );
    schemaRecordingFile = null;
  }

  return schemaRecordingFile;
};

export const all = async (): Promise<SchemaRecordingFile[]> => {
  const schemasFolderPath = await getSchemasFolderPath();

  const schemasFilenames = await new Promise<string[]>((resolve, reject) => {
    // glob path should always use forward slash, even in windows
    glob(
      `${schemasFolderPath}/*/schema.json`,
      { nonull: false },
      (error, files) => {
        if (error) {
          return reject(error);
        }
        return resolve(files);
      }
    );
  });

  return Promise.all(
    schemasFilenames.map(async (filename) => {
      return JSON.parse(await fs.promises.readFile(filename, 'utf8'));
    })
  );
};

type CreateNewSchemaRecording = (params: {
  schemaUrl: string;
  schemaHash: string;
  schemaName: string;
}) => Promise<string>;
const createNewSchemaRecording: CreateNewSchemaRecording = async ({
  schemaHash,
  schemaUrl,
  schemaName,
}) => {
  const temporarySchemaRecordingFile = await getTemporarySchemaRecordingFile(
    schemaHash
  );
  if (temporarySchemaRecordingFile === null) {
    throw new Error(`
      Error while creating new schema recording from temporary schema recording:
      Cannot find a file for the given temporary schema recording hash:${schemaHash}
    `);
  }

  const generateUniqueSchemaIdAndCreateSchemaRecordingFile = async (): Promise<SchemaRecordingFile> => {
    const newSchemaRecording: SchemaRecordingFile = {
      version: SCHEMA_FILE_VERSION,
      id: shortid.generate(),
      name: schemaName,
      hash: schemaHash,
      introspectionQuery: temporarySchemaRecordingFile.introspectionQuery,
    };

    const schemaRecordingFilePath = await getSchemaRecordingFilePath(
      newSchemaRecording.id
    );

    const newSchemaRecordingFile = editJsonFile(schemaRecordingFilePath);

    if (doesFileExist(newSchemaRecordingFile)) {
      return generateUniqueSchemaIdAndCreateSchemaRecordingFile();
    } else {
      mapObjectToJsonFile(newSchemaRecording, newSchemaRecordingFile);
      newSchemaRecordingFile.save();
      return newSchemaRecording;
    }
  };

  const {
    id: schemaId,
  } = await generateUniqueSchemaIdAndCreateSchemaRecordingFile();

  await createSchemaMapping({ schemaUrl, schemaId });

  return schemaId;
};

type BuildGraphqlSchema = (schemaId: string) => Promise<GraphQLSchema>;
const buildGraphQLSchema: BuildGraphqlSchema = async (schemaId) => {
  const schemaRecordingFile = await getSchemaRecordingFile(schemaId);
  if (schemaRecordingFile === null) {
    throw new Error(`
      Error while building graphql schema:
      Cannot find a file for a schema recording associated with the following schemaId:${schemaId}
    `);
  }

  return buildGraphQLSchemaFromIntrospectionQuery(
    schemaRecordingFile.introspectionQuery
  );
};

export interface SchemaDifferences {
  breakingChanges: ReturnType<typeof findBreakingChanges>;
  dangerousChanges: ReturnType<typeof findDangerousChanges>;
}

type DeriveSchemaDifferences = (params: {
  oldSchemaId: string;
  newSchemaHash: string;
}) => Promise<SchemaDifferences>;
const deriveSchemaDifferences: DeriveSchemaDifferences = async ({
  oldSchemaId,
  newSchemaHash,
}) => {
  const [oldSchema, newSchema] = await Promise.all([
    buildGraphQLSchema(oldSchemaId),
    buildGraphQLSchemaFromTemporarySchemaRecording(newSchemaHash),
  ]);

  const breakingChanges = findBreakingChanges(oldSchema, newSchema);
  const dangerousChanges = findDangerousChanges(oldSchema, newSchema);

  return {
    breakingChanges,
    dangerousChanges,
  };
};

export interface UpdatedSchemasMapping {
  schemaHash: string;
  schemaId: string;
}

type SchemaUpdateResponse = UpdatedSchemasMapping | SchemaDifferences;

type ConditionallyCreateOrUpdateSchemaRecordings = (
  schemaMappings: SchemasMappingsInput[]
) => Promise<SchemaUpdateResponse[]>;
export const conditionallyCreateOrUpdateSchemaRecordings: ConditionallyCreateOrUpdateSchemaRecordings = async (
  schemaMappings
) => {
  return Promise.all(
    schemaMappings.map<Promise<SchemaUpdateResponse>>(
      async ({
        opsRecordingsSchemaHash,
        targetSchemaId,
        opsRecordingsSchemaUrl,
        schemaName,
      }) => {
        // handle NEW schema case
        if (targetSchemaId === NEW_SCHEMA_NAME) {
          if (schemaName === null) {
            throw new Error(
              '"input.schemaMappings.schemaName" is required for new schema creation.'
            );
          }

          const newSchemaId = await createNewSchemaRecording({
            schemaUrl: opsRecordingsSchemaUrl,
            schemaHash: opsRecordingsSchemaHash,
            schemaName,
          });
          return {
            schemaHash: opsRecordingsSchemaHash,
            schemaId: newSchemaId,
          };
        }
        // handle existing schema case
        else {
          const doSchemaHashesMatch = await compareHashes(
            targetSchemaId,
            opsRecordingsSchemaHash
          );

          // let shouldUpdateSchemaHash = false;

          if (doSchemaHashesMatch === false) {
            const schemaDifferences = await deriveSchemaDifferences({
              oldSchemaId: targetSchemaId,
              newSchemaHash: opsRecordingsSchemaHash,
            });
            if (schemaDifferences.breakingChanges.length) {
              return schemaDifferences;
            }
            // shouldUpdateSchemaHash = true;
          }

          // TODO
          // if
          //    schemaUrl is not yet associated with the existing schema recording
          //    OR shouldUpdateSchemaHash
          // then:
          //
          // updateSchema({
          //   shouldUpdateHash: shouldUpdateSchemaHash,
          //   newSchemaUrl: opsRecordingsSchemaUrl
          // });

          return {
            schemaHash: opsRecordingsSchemaHash,
            schemaId: targetSchemaId,
          };
        }
      }
    )
  );
};
