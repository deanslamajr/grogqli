import editJsonFile from 'edit-json-file';
import {
  WorkflowFileBeforeCreation,
  WorkflowRecordingsFile,
  WorkflowRecordingsFileVersion1,
  addNewEntryToWorkflowMappingFile,
} from '../files/workflow';
import {
  doesFileExist,
  getWorkflowRecordingFilePath,
  mapObjectToJsonFile,
} from '../files';

type CreateNewWorkflowFile = (params: {
  newWorkflowFileWithoutId: WorkflowFileBeforeCreation;
  workflowName: string;
}) => Promise<void>;

export const createNewWorkflowAssets: CreateNewWorkflowFile = async ({
  newWorkflowFileWithoutId,
  workflowName,
}) => {
  const workflowId: string = await addNewEntryToWorkflowMappingFile(
    workflowName
  );

  const pathToWorkflowFile = await getWorkflowRecordingFilePath(workflowId);
  const workflowFile = editJsonFile(pathToWorkflowFile);

  // if this file has already been initialized, throw error
  // this is to prevent unexpected behavior
  if (doesFileExist(workflowFile)) {
    throw new Error(`File for workflow:${workflowId} already exists!`);
  }

  const workflowFileContents: WorkflowRecordingsFile = {
    ...(newWorkflowFileWithoutId as WorkflowRecordingsFileVersion1),
    id: workflowId,
  };

  mapObjectToJsonFile(workflowFileContents, workflowFile);

  workflowFile.save();
};
