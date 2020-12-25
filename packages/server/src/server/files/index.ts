import editJsonFile from 'edit-json-file';
import fs from 'fs';
import path from 'path';
import { IntrospectionQuery } from 'graphql';

import { getConfig } from './getConfig';

export interface SchemaFile {
  id: string;
  version: number;
  introspectionQuery: IntrospectionQuery;
}

// Directory structure
//
// /grogqli
//   /schemas
//     schemas.json
//     /<schemaId>
//       operations.json
//       schema.json
//       types.json
//   /operations
//     someOperationId.json
//   /types
//     someTypeId.json
//   /workflows
//     someWorkFlowId.json
//   /local
//     appState.json
//     /schemas
//     /queries
const SCHEMAS_FOLDER_NAME = 'schemas';
const SCHEMA_FILENAME = 'schema.json';
export const OPERATIONS_FILENAME = 'operations.json';
export const TYPES_NAME_TO_ID_MAPPING_FILENAME = 'types.json';
export const OPERATIONS_FOLDER_NAME = 'operations';
export const WORKFLOWS_FOLDER_NAME = 'workflows';
export const TYPES_FOLDER_NAME = 'types';
const TEMP_FOLDER_NAME = 'local';
const TEMP_SCHEMAS_FOLDER_NAME = 'schemas';
const TEMP_QUERIES_FOLDER_NAME = 'queries';

const createDirIfDoesntExist = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const getRecordingsRootDir = async (): Promise<string> => {
  const config = await getConfig();
  const recordingsRootDir = config('recordingsSaveDirectory');
  createDirIfDoesntExist(recordingsRootDir);
  return recordingsRootDir;
};

export const getQueryRecordingsFile = async (): Promise<
  editJsonFile.JsonEditor
> => {
  const config = await getConfig();
  const recordingsRootDir = await getRecordingsRootDir();
  const queryRecordingsPath = path.join(
    recordingsRootDir,
    TEMP_FOLDER_NAME,
    TEMP_QUERIES_FOLDER_NAME
  );

  createDirIfDoesntExist(queryRecordingsPath);

  return editJsonFile(
    path.join(queryRecordingsPath, `${config('recordingsFilename')}.json`)
  );
};

// Schema
// ***
// **
// *

export const getTemporarySchemaRecordingsPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const schemaRecordingsPath = path.join(
    recordingsRootDir,
    TEMP_FOLDER_NAME,
    TEMP_SCHEMAS_FOLDER_NAME
  );
  createDirIfDoesntExist(schemaRecordingsPath);
  return schemaRecordingsPath;
};

export const getSchemasFolderPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const schemasFolderPath = path.join(recordingsRootDir, SCHEMAS_FOLDER_NAME);
  createDirIfDoesntExist(schemasFolderPath);
  return schemasFolderPath;
};

export const getSchema = async (schemaId: string): Promise<SchemaFile> => {
  const schemasFolderPath = await getSchemasFolderPath();
  // TODO after a feature is added that updates these `${schemaId}.json` files at runtime,
  // reevaluate whether or not this is necessary:
  // return JSON.parse(
  //   // not using require(`${schemaId}.json`) here (unlike in the resolvers)
  //   // bc we want to bypass the auto caching feature of require
  //   fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  // );
  const pathToSchema = path.join(schemasFolderPath, schemaId, SCHEMA_FILENAME);
  let schema: SchemaFile;
  try {
    schema = require(pathToSchema);
  } catch (error) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where a schema file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }
  return schema;
};
