import editJsonFile from 'edit-json-file';
import fs from 'fs';
import path from 'path';
import { IntrospectionQuery } from 'graphql';

import { getConfig } from './getConfig';

const createDirIfDoesntExist = (dirPath: string) => {
  return fs.promises.mkdir(dirPath, { recursive: true });
};

export const doesFileExist = (file: editJsonFile.JsonEditor): boolean => {
  return Object.keys(file.read()).length > 0;
};

export const mapObjectToJsonFile = <T extends object>(
  object: T,
  file: editJsonFile.JsonEditor
): void => {
  Object.entries(object).forEach(([key, value]) => {
    file.set(key, value);
  });
};

// Directory structure
//
// /grogqli
//   /schemas
const SCHEMAS_FOLDER_NAME = 'schemas';
//     index.json
//     /<schemaId>
//       operations.json
export const OPERATIONS_NAME_TO_ID_MAPPING_FILENAME = 'operations.json';
export const OPERATIONS_NAME_TO_ID_MAPPING_VERSION = 1;
//       schema.json
const SCHEMA_FILENAME = 'schema.json';
//       types.json
const TYPES_NAME_TO_ID_MAPPING_FILENAME = 'types.json';
export const TYPES_NAME_TO_ID_MAPPING_VERSION = 1;
//   /operations
export const OPERATIONS_FOLDER_NAME = 'operations';
export const OPERATIONS_RECORDING_VERSION = 1;
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
//     sessions.json
const HANDLER_SESSIONS_STATE_FILENAME = 'sessions.json';
export const HANDLER_SESSIONS_STATE_FILE_VERSION = 1;
//     /schemas
const TEMP_SCHEMAS_FOLDER_NAME = 'schemas';
//     /queries
const TEMP_QUERIES_FOLDER_NAME = 'queries';

// e.g. /grogqli
export const getRecordingsRootDir = async (): Promise<string> => {
  const config = await getConfig();
  const recordingsRootDir = config('recordingsSaveDirectory');
  await createDirIfDoesntExist(recordingsRootDir);
  return recordingsRootDir;
};

// e.g. /grogqli/schemas
export const getSchemasFolderPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const schemasFolderPath = path.join(recordingsRootDir, SCHEMAS_FOLDER_NAME);
  await createDirIfDoesntExist(schemasFolderPath);
  return schemasFolderPath;
};

// e.g. /grogqli/schemas/<schemaId>/operations.json
export const getOpNameMappingFilePath = async (schemaId: string) => {
  const schemasFolderPath = await getSchemasFolderPath();

  const opNameMappingFilePath = path.join(schemasFolderPath, schemaId);

  await createDirIfDoesntExist(opNameMappingFilePath);

  return path.join(
    opNameMappingFilePath,
    OPERATIONS_NAME_TO_ID_MAPPING_FILENAME
  );
};

// e.g. /grogqli/schemas/<schemaId>/types.json
export const getTypeNameMappingFilePath = async (schemaId: string) => {
  const schemasFolderPath = await getSchemasFolderPath();

  const typeNameMappingFilePath = path.join(schemasFolderPath, schemaId);

  await createDirIfDoesntExist(typeNameMappingFilePath);

  return path.join(typeNameMappingFilePath, TYPES_NAME_TO_ID_MAPPING_FILENAME);
};

// e.g. /grogqli/workflows
export const getWorkflowsFolderPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const workflowsFolderPath = path.join(
    recordingsRootDir,
    WORKFLOWS_FOLDER_NAME
  );
  await createDirIfDoesntExist(workflowsFolderPath);
  return workflowsFolderPath;
};

// e.g. /grogqli/workflows/index.json
export const getWorkflowNameMappingFilePath = async (): Promise<string> => {
  const workflowsFolderPath = await getWorkflowsFolderPath();
  return path.join(workflowsFolderPath, WORKFLOWS_NAME_TO_ID_MAPPING_FILENAME);
};

// e.g. /grogqli/workflows/<workflowId>.json
export const getWorkflowRecordingFilePath = async (
  workflowId: string
): Promise<string> => {
  const workflowsFolderPath = await getWorkflowsFolderPath();
  return path.join(workflowsFolderPath, `${workflowId}.json`);
};

// e.g. /grogqli/operations/<opId>.json
export const getOperationRecordingsFilePath = async (
  opId: string
): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const pathToOperationRecordingFile = path.join(
    recordingsRootDir,
    OPERATIONS_FOLDER_NAME
  );

  await createDirIfDoesntExist(pathToOperationRecordingFile);

  return path.join(pathToOperationRecordingFile, `${opId}.json`);
};

// e.g. /grogqli/types/<typeId>.json
export const getTypeFilePath = async (typeId: string) => {
  const recordingsRootDir = await getRecordingsRootDir();

  const typeFilePath = path.join(recordingsRootDir, TYPES_FOLDER_NAME);

  await createDirIfDoesntExist(typeFilePath);

  return path.join(typeFilePath, `${typeId}.json`);
};

// e.g. /grogqli/local/schemas
export const getTemporarySchemaRecordingsPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const schemaRecordingsPath = path.join(
    recordingsRootDir,
    TEMP_FOLDER_NAME,
    TEMP_SCHEMAS_FOLDER_NAME
  );
  await createDirIfDoesntExist(schemaRecordingsPath);
  return schemaRecordingsPath;
};

// e.g. /grogqli/local/sessions.json
export const getSessionsFilePath = async () => {
  const recordingsRootDir = await getRecordingsRootDir();

  const tempFolderPath = path.join(recordingsRootDir, TEMP_FOLDER_NAME);

  await createDirIfDoesntExist(tempFolderPath);

  return path.join(tempFolderPath, HANDLER_SESSIONS_STATE_FILENAME);
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

  await createDirIfDoesntExist(queryRecordingsPath);

  return editJsonFile(
    path.join(queryRecordingsPath, `${config('recordingsFilename')}.json`)
  );
};

// Schema
// ***
// **
// *
export interface SchemaFile {
  id: string;
  version: number;
  introspectionQuery: IntrospectionQuery;
}

export const getSchema = async (schemaId: string): Promise<SchemaFile> => {
  const schemasFolderPath = await getSchemasFolderPath();
  const absPathToSchema = path.join(schemasFolderPath, schemaId);

  await createDirIfDoesntExist(absPathToSchema);

  const absPathToSchemaFile = path.join(absPathToSchema, SCHEMA_FILENAME);

  return JSON.parse(await fs.promises.readFile(absPathToSchemaFile, 'utf8'));
};
