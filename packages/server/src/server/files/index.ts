import editJsonFile from 'edit-json-file';
import fs from 'fs';
import path from 'path';
import { IntrospectionQuery } from 'graphql';

import { getConfig } from './getConfig';

import { getOperationFile, OperationFile } from './operation';

export interface SchemaFile {
  id: string;
  version: number;
  introspectionQuery: IntrospectionQuery;
}

export type TypeRecordingValue = { [fieldName: string]: any };

interface TypeRecording {
  version: number;
  id: string;
  value: TypeRecordingValue;
}

export interface TypeRecordingsFile {
  id: string;
  version: number;
  recordings: { [recordingId: string]: TypeRecording };
}

interface GetTypeRecordingParams {
  typeId: string;
  recordingId: string;
}

export interface TypeNameToIdMapping {
  version: number;
  types: {
    [typeName: string]: {
      name: string;
      id: string;
    };
  };
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
const TYPES_NAME_TO_ID_MAPPING_FILENAME = 'types.json';
export const OPERATIONS_FOLDER_NAME = 'operations';
export const WORKFLOWS_FOLDER_NAME = 'workflows';
const TYPES_FOLDER_NAME = 'types';
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

// Types
// ***
// **
// *

interface GetTypeIdFromTypeNameParams {
  typeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
}

export const getTypeIdFromTypeName = async ({
  typeName,
  typeNameToIdMappingData,
}: GetTypeIdFromTypeNameParams): Promise<string> => {
  // return the mapping of the given typeName
  const type = typeNameToIdMappingData.types[typeName];
  // TODO handle the case where the given typeName does not exist in the given schemaId's types.json
  if (type === undefined) {
    throw new Error(`
      TODO handle the case where the given typeName does not exist in the given types.json.
      typeName:${typeName}
    `);
  }
  return type.id;
};

type GetRootTypeRecordingIdFromOpRecording = (params: {
  rootTypeId: string;
  opId: string;
  opRecordingId: string;
}) => Promise<string | null>;

export const getRootTypeRecordingIdFromOpRecording: GetRootTypeRecordingIdFromOpRecording = async ({
  rootTypeId,
  opId,
  opRecordingId,
}) => {
  // get opId.json
  const opFile: OperationFile | null = await getOperationFile(opId);

  if (opFile === null) {
    // TODO handle case where operation file does not exist for given operation id
    throw new Error(
      `TODO handle case where operation file does not exist for given operation id. operationId:${opId}`
    );
  }
  // return the recordingId associated with the given typeId
  const opRecording = opFile.recordings[opRecordingId];

  if (opRecording === undefined) {
    // TODO handle case where operation file does not have a recording for the given operation recording id
    throw new Error(
      `TODO handle case where operation file does not have a recording for the given operation recording id. opRecordingId:${opRecordingId}`
    );
  }

  const rootTypeRecordingEntry = opRecording.rootTypeRecordings[rootTypeId];

  if (rootTypeRecordingEntry === undefined) {
    // TODO handle case where the given operation recording does not have an entry for the given root type id
    throw new Error(
      `TODO handle case where the given operation recording does not have an entry for the given root type id.
        opRecordingId:${opRecordingId}
        rootTypeId:${rootTypeId}`
    );
  }

  return rootTypeRecordingEntry.recordingId || null;
};

export const getTypeRecording = async ({
  typeId,
  recordingId,
}: GetTypeRecordingParams): Promise<TypeRecording> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const pathToTypeRecordings = path.join(
    recordingsRootDir,
    TYPES_FOLDER_NAME,
    `${typeId}.json`
  );

  let typeRecordings: TypeRecordingsFile;
  try {
    typeRecordings = require(pathToTypeRecordings);
  } catch (error) {
    console.error(error);
    // TODO handle case where file does not exist for given typeId
    throw new Error(
      `TODO Handle case where type file does not exist. typeId:${typeId}`
    );
  }

  const typeRecording: TypeRecording | undefined =
    typeRecordings.recordings[recordingId];

  if (typeRecording === undefined) {
    // TODO handle case where type file does not have a recording for the given recordingId
    throw new Error(
      `TODO Handle case where type file does not have a recording for the given id. typeId:${typeId} recordingId:${recordingId}`
    );
  }

  return typeRecording;
};

export const openTypeNameToIdMapping = async (
  schemaId: string
): Promise<TypeNameToIdMapping> => {
  const schemasFolderPath = await getSchemasFolderPath();
  // TODO after a feature is added that updates these `${schemaId}.json` files at runtime,
  // reevaluate whether or not this is necessary:
  // return JSON.parse(
  //   // not using require(`${schemaId}.json`) here (unlike in the resolvers)
  //   // bc we want to bypass the auto caching feature of require
  //   fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  // );
  const pathToTypeNameToIdMappingFile = path.join(
    schemasFolderPath,
    schemaId,
    TYPES_NAME_TO_ID_MAPPING_FILENAME
  );
  let typeNameToIdMappingFile: TypeNameToIdMapping;
  try {
    typeNameToIdMappingFile = require(pathToTypeNameToIdMappingFile);
  } catch (error) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where a type name to id mappings file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }
  return typeNameToIdMappingFile;
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
