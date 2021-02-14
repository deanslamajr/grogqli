import shortid from 'shortid';
import {
  buildSchema,
  IntrospectionQuery,
  lexicographicSortSchema,
  printSchema,
  stripIgnoredCharacters,
} from 'graphql';
import editJsonFile from 'edit-json-file';
import crypto from 'crypto';

import { createSchemaSDL } from '../createSchemaSDL';

import {
  doesFileExist,
  getTemporarySchemaRecordingFilename,
  mapObjectToJsonFile,
  TEMP_SCHEMA_FILE_VERSION,
} from './';

export type TemporarySchemaRecording = TemporarySchemaRecordingVersion1;
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
  const schemaHash = await generateHashFromSchema(schemaIntrospectionResult);

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
  }

  return schemaHash;
};

// from https://github.com/graphql/graphql-js/blob/998bea680d6e11e1c055a400a887a9539de08f75/src/utilities/__tests__/lexicographicSortSchema-test.js#L10
const sortSDL = (sdl: string): string => {
  const schema = buildSchema(sdl);
  return printSchema(lexicographicSortSchema(schema));
};

const generateHash = (stringToHash: string): string => {
  return crypto.createHash('sha1').update(stringToHash).digest('base64');
};

export const generateHashFromSchema = async (
  schemaIntrospectionResult: IntrospectionQuery
): Promise<string> => {
  // 1st - Create SDL string from introspection result object
  const schemaSdl: string = await createSchemaSDL(schemaIntrospectionResult);
  // 2nd - Sort the schema SDL
  const sortedSchemaSdl: string = sortSDL(schemaSdl);
  // 3rd - Remove any characters from SDL string that do not affect the behavior of the schema
  const cleanedSchemaSdl: string = stripIgnoredCharacters(sortedSchemaSdl);
  // Final - Generate hash
  return generateHash(cleanedSchemaSdl);
};
