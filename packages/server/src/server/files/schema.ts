import shortid from 'shortid';
import editJsonFile from 'edit-json-file';
import { IntrospectionQuery } from 'graphql';
import { SchemasMappingsInput } from '@grogqli/schema';
import fs from 'fs';
import glob from 'glob';

import { add as createSchemaMapping } from './schemaMapping';
import { TemporarySchemaRecording } from './tempSchemaRecording';

import {
  doesFileExist,
  getTemporarySchemaRecordingFilename,
  mapObjectToJsonFile,
  SCHEMA_FILE_VERSION,
  getSchemaRecordingFilePath,
  getSchemasFolderPath,
} from './';

export type SchemaRecording = SchemaRecordingVersion1;
interface SchemaRecordingVersion1 {
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
  return schemaRecordingFile.hash === hash;
};

export const getSchemaRecordingFile = async (
  schemaId: string
): Promise<SchemaRecording> => {
  const schemaRecordingFilePath = await getSchemaRecordingFilePath(schemaId);

  return JSON.parse(
    await fs.promises.readFile(schemaRecordingFilePath, 'utf8')
  );
};

export const all = async () => {
  const schemasFolderPath = await getSchemasFolderPath();

  console.log('schemasFolderPath', schemasFolderPath);

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
  const tempSchemaRecordingsPath = await getTemporarySchemaRecordingFilename(
    schemaHash
  );

  let temporarySchemaRecordingFile: TemporarySchemaRecording;
  try {
    temporarySchemaRecordingFile = JSON.parse(
      await fs.promises.readFile(tempSchemaRecordingsPath, 'utf8')
    );
  } catch (error) {
    console.error(error);
    throw new Error(`
      Error while creating new schema recording from temporary schema recording:
      Cannot find a file for the given temporary schema recording hash:${schemaHash}
    `);
  }

  const generateUniqueSchemaIdAndCreateSchemaRecordingFile = async (): Promise<SchemaRecording> => {
    const newSchemaRecording: SchemaRecording = {
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

export interface UpdatedSchemasMapping {
  schemaHash: string;
  schemaId: string;
}

type ConditionallyCreateOrUpdateSchemaRecordings = (
  schemaMappings: SchemasMappingsInput[]
) => Promise<UpdatedSchemasMapping[]>;
export const conditionallyCreateOrUpdateSchemaRecordings: ConditionallyCreateOrUpdateSchemaRecordings = async (
  schemaMappings
) => {
  return Promise.all(
    schemaMappings.map<Promise<UpdatedSchemasMapping>>(
      async ({
        opsRecordingsSchemaHash,
        targetSchemaId,
        opsRecordingsSchemaUrl,
        schemaName,
      }) => {
        // handle NEW case
        if (targetSchemaId === 'NEW') {
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
        } else {
          const doSchemaHashesMatch = await compareHashes(
            targetSchemaId,
            opsRecordingsSchemaHash
          );

          if (!doSchemaHashesMatch) {
            throw new Error('TODO: Schema hashes dont match');
          }

          // TODO
          // handle conditionally adding any new opsRecordingsSchemaUrl's to the mapped targetSchemaId
          return {
            schemaHash: opsRecordingsSchemaHash,
            schemaId: targetSchemaId,
          };
        }
      }
    )
  );
};
