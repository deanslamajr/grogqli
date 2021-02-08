import shortid from 'shortid';
import editJsonFile from 'edit-json-file';
import { IntrospectionQuery } from 'graphql';
import {
  CreateTemporaryOperationRecording,
  SchemasMappingsInput,
} from '@grogqli/schema';
import fs from 'fs';

import {
  doesFileExist,
  getTemporarySchemaRecordingFilename,
  mapObjectToJsonFile,
  SCHEMA_FILE_VERSION,
  getSchemaRecordingFilePath,
  TEMP_SCHEMA_FILE_VERSION,
} from './';

type TemporarySchemaRecording = TemporarySchemaRecordingVersion1;
interface TemporarySchemaRecordingVersion1 {
  version: 1;
  hash: string;
  introspectionQuery: IntrospectionQuery;
}

type PersistTempSchemaRecording = (
  schemaIntrospectionResult: IntrospectionQuery
) => Promise<string>;

export const persistTempSchemaRecording: PersistTempSchemaRecording = async (
  schemaIntrospectionResult
) => {
  // TODO generate schema hash
  const schemaHash = shortid.generate();

  const newTempSchemaRecording: TemporarySchemaRecording = {
    version: TEMP_SCHEMA_FILE_VERSION,
    hash: schemaHash,
    introspectionQuery: schemaIntrospectionResult,
  };

  const schemaRecordingsPath = await getTemporarySchemaRecordingFilename(
    schemaHash
  );

  const newTempSchemaRecordingFile = editJsonFile(schemaRecordingsPath);

  if (!doesFileExist(newTempSchemaRecordingFile)) {
    mapObjectToJsonFile(newTempSchemaRecording, newTempSchemaRecordingFile);
    newTempSchemaRecordingFile.save();
  } else {
    console.log(`Schema with hash:${schemaHash} has already been recorded!`);
  }

  return schemaHash;
};

export type SchemaRecording = SchemaRecordingVersion1;
interface SchemaRecordingVersion1 {
  version: 1;
  id: string;
  name: string;
  hash: string;
  urls: string[];
  introspectionQuery: IntrospectionQuery;
}

export const getSchemaRecordingFile = async (
  schemaId: string
): Promise<SchemaRecording> => {
  const schemaRecordingFilePath = await getSchemaRecordingFilePath(schemaId);

  return JSON.parse(
    await fs.promises.readFile(schemaRecordingFilePath, 'utf8')
  );
};

type CreateNewSchemaRecording = (params: {
  schemaUrl: string;
  schemaHash: string;
}) => Promise<string>;
const createNewSchemaRecording: CreateNewSchemaRecording = async ({
  schemaHash,
  schemaUrl,
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
      name: 'tester schema', // TODO replace with user input
      hash: schemaHash,
      urls: [schemaUrl],
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

  const newSchemaRecording = await generateUniqueSchemaIdAndCreateSchemaRecordingFile();

  return newSchemaRecording.id;
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
      }) => {
        // handle NEW case
        if (targetSchemaId === 'NEW') {
          const newSchemaId = await createNewSchemaRecording({
            schemaUrl: opsRecordingsSchemaUrl,
            schemaHash: opsRecordingsSchemaHash,
          });
          return {
            schemaHash: opsRecordingsSchemaHash,
            schemaId: newSchemaId,
          };
        } else {
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
