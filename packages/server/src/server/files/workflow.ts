import path from 'path';
import { getRecordingsRootDir, WORKFLOWS_FOLDER_NAME } from './';

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

interface WorkflowFileVersion0 {
  version: 0;
}

interface WorkflowFileVersion1 {
  version: 1;
  id: string;
  name: string;
  description: string;
  operationRecordings: {
    [opId: string]: {
      opId: string;
      opRecordingId: string;
    };
  };
}

export type WorkflowFile = WorkflowFileVersion0 | WorkflowFileVersion1;

export type WorkflowFileBeforeCreation = DistributiveOmit<WorkflowFile, 'id'>;

export const getWorkflowById = async (
  workflowId: string
): Promise<WorkflowFile | null> => {
  if (!workflowId) {
    return null;
  }
  let workflow: WorkflowFile;
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
