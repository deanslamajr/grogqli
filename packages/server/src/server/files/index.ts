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
const SCHEMAS_FOLDER_NAME = 'schemas';
//     schemas.json
//     /<schemaId>
//       operations.json
export const OPERATIONS_FILENAME = 'operations.json';
//       schema.json
const SCHEMA_FILENAME = 'schema.json';
//       types.json
const TYPES_NAME_TO_ID_MAPPING_FILENAME = 'types.json';
export const TYPES_NAME_TO_ID_MAPPING_VERSION = 1;
//   /operations
export const OPERATIONS_FOLDER_NAME = 'operations';
//     someOperationId.json
//   /types
const TYPES_FOLDER_NAME = 'types';
//     <typeId>.json
export const TYPES_FILE_VERSION = 1;
//   /workflows
export const WORKFLOWS_FOLDER_NAME = 'workflows';
//     index.json
const WORKFLOWS_NAME_TO_ID_MAPPING_FILENAME = 'index.json';
export const WORKFLOWS_NAME_TO_ID_MAPPING_VERSION = 1;
//     <workflowId>.json
//   /local
const TEMP_FOLDER_NAME = 'local';
//     appState.json
//     /schemas
const TEMP_SCHEMAS_FOLDER_NAME = 'schemas';
//     /queries
const TEMP_QUERIES_FOLDER_NAME = 'queries';

const createDirIfDoesntExist = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// e.g. /grogqli
export const getRecordingsRootDir = async (): Promise<string> => {
  const config = await getConfig();
  const recordingsRootDir = config('recordingsSaveDirectory');
  createDirIfDoesntExist(recordingsRootDir);
  return recordingsRootDir;
};

// e.g. /grogqli/local/schemas
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

// e.g. /grogqli/schemas
export const getSchemasFolderPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const schemasFolderPath = path.join(recordingsRootDir, SCHEMAS_FOLDER_NAME);
  createDirIfDoesntExist(schemasFolderPath);
  return schemasFolderPath;
};

// e.g. /grogqli/schemas/<schemaId>/types.json
export const getTypeNameMappingFilePath = async (schemaId: string) => {
  const schemasFolderPath = await getSchemasFolderPath();

  const typeNameMappingFilePath = path.join(
    schemasFolderPath,
    schemaId,
    TYPES_NAME_TO_ID_MAPPING_FILENAME
  );

  createDirIfDoesntExist(typeNameMappingFilePath);

  return typeNameMappingFilePath;
};

// e.g. /grogqli/workflows
export const getWorkflowsFolderPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const workflowsFolderPath = path.join(
    recordingsRootDir,
    WORKFLOWS_FOLDER_NAME
  );
  createDirIfDoesntExist(workflowsFolderPath);
  return workflowsFolderPath;
};

// e.g. /grogqli/workflows/index.json
export const getWorkflowNameMappingFilePath = async (): Promise<string> => {
  const workflowsFolderPath = await getWorkflowsFolderPath();

  const workflowNameMappingFilePath = path.join(
    workflowsFolderPath,
    WORKFLOWS_NAME_TO_ID_MAPPING_FILENAME
  );

  createDirIfDoesntExist(workflowNameMappingFilePath);

  return workflowNameMappingFilePath;
};

// e.g. /grogqli/workflows/<workflowId>.json
export const getWorkflowRecordingFilePath = async (
  workflowId: string
): Promise<string> => {
  const workflowsFolderPath = await getWorkflowsFolderPath();

  const workflowFilePath = path.join(workflowsFolderPath, `${workflowId}.json`);

  createDirIfDoesntExist(workflowFilePath);

  return workflowFilePath;
};

// e.g. /grogqli/types/<typeId>.json
export const getTypeFilePath = async (typeId: string) => {
  const recordingsRootDir = await getRecordingsRootDir();

  const typeFilePath = path.join(
    recordingsRootDir,
    TYPES_FOLDER_NAME,
    `${typeId}.json`
  );

  createDirIfDoesntExist(typeFilePath);

  return typeFilePath;
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
