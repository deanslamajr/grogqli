import editJsonFile from 'edit-json-file';
import fs from 'fs';
import path from 'path';

import { getConfig } from '../../../getConfig';

export interface WorkflowData {
  version: number;
  name: string;
  recordings: {
    [opId: string]: {
      rootTypeRecordingId: string;
    };
  };
}

// Directory structure
//
// /grogqli
//   /schemas
//     schemas.json
//     /<schemaId>
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
const WORKFLOWS_FOLDER_NAME = 'workflows';
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

export const getSchemaRecordingsPath = async (): Promise<string> => {
  const recordingsRootDir = await getRecordingsRootDir();
  const schemaRecordingsPath = path.join(
    recordingsRootDir,
    TEMP_FOLDER_NAME,
    TEMP_SCHEMAS_FOLDER_NAME
  );
  createDirIfDoesntExist(schemaRecordingsPath);
  return schemaRecordingsPath;
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
