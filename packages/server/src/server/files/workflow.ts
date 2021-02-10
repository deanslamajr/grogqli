import shortid from 'shortid';
import editJsonFile from 'edit-json-file';
import fs from 'fs';

import { DistributiveOmit } from '../types';
import {
  doesFileExist,
  getWorkflowRecordingFilePath,
  getWorkflowNameMappingFilePath,
  mapObjectToJsonFile,
  WORKFLOWS_NAME_TO_ID_MAPPING_VERSION,
} from './';

interface Workflow {
  name: string;
  id: string;
}

// pattern to support versioning this file structure
export type WorkflowNameMappingFileContents = WorkflowNameMappingFileContentsVersion1;
interface WorkflowNameMappingFileContentsVersion1 {
  version: 1;
  workflows: {
    [workflowName: string]: Workflow;
  };
}

type GetWorkflows = () => Promise<Workflow[]>;
export const getWorkflows: GetWorkflows = async () => {
  const pathToWorkflowNameToIdMappingFile = await getWorkflowNameMappingFilePath();
  const workflowNameMappingFile = await editJsonFile(
    pathToWorkflowNameToIdMappingFile
  );
  return Object.values<
    WorkflowNameMappingFileContentsVersion1['workflows'][keyof WorkflowNameMappingFileContentsVersion1['workflows']]
  >(workflowNameMappingFile.get('workflows'));
};

type AddNewEntryToWorkflowMappingFile = (
  workflowName: string
) => Promise<string>;
export const addNewEntryToWorkflowMappingFile: AddNewEntryToWorkflowMappingFile = async (
  workflowName
) => {
  const pathToWorkflowNameToIdMappingFile = await getWorkflowNameMappingFilePath();
  const workflowNameMappingFile = await editJsonFile(
    pathToWorkflowNameToIdMappingFile
  );

  let newWorkflowId;
  // handle the case where mappings file does not exist
  if (!doesFileExist(workflowNameMappingFile)) {
    newWorkflowId = shortid.generate();
    const initializedWorkflowNamesMappingFileData: WorkflowNameMappingFileContentsVersion1 = {
      version: WORKFLOWS_NAME_TO_ID_MAPPING_VERSION,
      workflows: {
        [workflowName]: {
          name: workflowName,
          id: newWorkflowId,
        },
      },
    };
    mapObjectToJsonFile(
      initializedWorkflowNamesMappingFileData,
      workflowNameMappingFile
    );
  } else {
    const workflowMappings = Object.values<
      WorkflowNameMappingFileContentsVersion1['workflows'][keyof WorkflowNameMappingFileContentsVersion1['workflows']]
    >(workflowNameMappingFile.get('workflows'));

    // generate a new workflowId that is unique against the existing set of workflowId's
    let newIdIsNotUnique = true;
    do {
      newWorkflowId = shortid.generate();
      newIdIsNotUnique = workflowMappings.some(
        // eslint-disable-next-line no-loop-func
        ({ id }) => id === newWorkflowId
      );
    } while (newIdIsNotUnique);

    workflowMappings[workflowName] = {
      name: workflowName,
      id: newWorkflowId,
    };

    workflowNameMappingFile.set('workflows', workflowMappings);
  }

  workflowNameMappingFile.save();

  return newWorkflowId;
};

// pattern to support versioning this file structure
// TODO remove version0 after a version2 exists
// this is here to help provide an example of how to do this
// (before there was more than a single version)
interface WorkflowRecordingsFileVersion0 {
  version: 0;
}
export type WorkflowRecordingsFile =
  | WorkflowRecordingsFileVersion0
  | WorkflowRecordingsFileVersion1;
export interface WorkflowRecordingsFileVersion1 {
  id: string;
  version: 1;
  description: string;
  operationRecordings: {
    [opId: string]: {
      opId: string;
      opRecordingId: string;
    };
  };
}

export type WorkflowFileBeforeCreation = DistributiveOmit<
  WorkflowRecordingsFile,
  'id'
>;

export const getWorkflowById = async (
  workflowId: string
): Promise<WorkflowRecordingsFile | null> => {
  if (!workflowId) {
    return null;
  }

  const pathToWorkflow = await getWorkflowRecordingFilePath(workflowId);
  let workflow: WorkflowRecordingsFile;

  try {
    workflow = JSON.parse(await fs.promises.readFile(pathToWorkflow, 'utf8'));
  } catch (error) {
    console.error(error);
    return null;
  }

  return workflow;
};
