import editJsonFile from 'edit-json-file';
import fs from 'fs';
import path from 'path';
import { IntrospectionQuery } from 'graphql';

import { getConfig } from '../../../getConfig';

export interface WorkflowData {
  version: 1;
  id: string;
  name: string;
  recordings: {
    [opId: string]: {
      rootTypeRecordingId: string;
    };
  };
}

export interface SchemaFile {
  id: string;
  version: 1;
  introspectionQuery: IntrospectionQuery;
}

export type TypeRecordingValue = { [fieldName: string]: any };

interface TypeRecording {
  version: 1;
  id: string;
  value: TypeRecordingValue;
}

interface TypeRecordings {
  id: string;
  version: 1;
  recordings: { [recordingId: string]: TypeRecording };
}

interface GetTypeRecordingParams {
  typeId: string;
  recordingId: string;
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
//   /types
//     someTypeId.json
//   /workflows
//     someWorkFlowId.json
//   /__unsaved
//     appState.json
//     /schemas
//     /queries
const SCHEMAS_FOLDER_NAME = 'schemas';
const WORKFLOWS_FOLDER_NAME = 'workflows';
const TYPES_FOLDER_NAME = 'types';
const TEMP_FOLDER_NAME = '__unsaved';
const TEMP_SCHEMAS_FOLDER_NAME = 'schemas';
const TEMP_QUERIES_FOLDER_NAME = 'queries';

const createDirIfDoesntExist = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const getRecordingsRootDir = async (): Promise<string> => {
  const config = await getConfig();
  const recordingsRootDir = config('recordingsSaveDirectory');
  createDirIfDoesntExist(recordingsRootDir);
  return recordingsRootDir;
};

export const getWorkflowById = async (
  workflowId: string
): Promise<WorkflowData | null> => {
  if (!workflowId) {
    return null;
  }
  let workflow: WorkflowData;
  const recordingsRootDir = await getRecordingsRootDir();
  const pathToWorkflow = path.join(
    recordingsRootDir,
    WORKFLOWS_FOLDER_NAME,
    `${workflowId}.json`
  );

  try {
    workflow = require(pathToWorkflow);
  } catch (error) {
    return null;
  }

  return workflow;
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

  let typeRecordings: TypeRecordings;
  try {
    typeRecordings = require(pathToTypeRecordings);
  } catch (error) {
    console.error(error);
    // TODO handle case where file does not exist for given typeId
    throw new Error(
      `Handle case where type file does not exist. typeId:${typeId}`
    );
  }

  const typeRecording: TypeRecording | undefined =
    typeRecordings.recordings[recordingId];

  if (typeRecording === undefined) {
    // TODO handle case where type file does not have a recording for the given recordingId
    throw new Error(
      `Handle case where type file does not have a recording for the given id. typeId:${typeId} recordingId:${recordingId}`
    );
  }

  return typeRecording;
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
  // reevaluate whether or not this is necessary
  // return JSON.parse(
  // not using require(`${schemaId}.json`) here (unlike in the resolvers)
  // bc we want to bypass the auto caching feature of require
  // fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  // );
  const pathToSchema = path.join(schemasFolderPath, schemaId, 'schema.json');
  let schema: SchemaFile;
  try {
    schema = require(pathToSchema);
  } catch (error) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }
  return schema;
};

export interface OperationsData {
  version: number;
  recordings: {
    [opName: string]: {
      opId: string;
      typeId: string;
    };
  };
}
export const getOperationsData = async (): Promise<OperationsData> => {};
