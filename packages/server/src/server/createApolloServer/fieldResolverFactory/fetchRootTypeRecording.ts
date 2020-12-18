import {
  getTypeRecording,
  getWorkflowById,
  getRootTypeRecordingIdFromOpRecording,
  getTypeIdFromTypeName,
  OperationsData,
  TypeNameToIdMapping,
  WorkflowData,
} from '../../files';

interface GetOpDataParams {
  operationsData: OperationsData;
  opName: string;
}

interface GetRootTypeRecordingIdParams {
  opId: string;
  workflowId: string;
}

export interface FetchRootTypeRecordingParams {
  opName: string;
  operationsData: OperationsData;
  rootTypeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
  workflowId: string;
}

const getOpIdFromOpName = ({
  operationsData,
  opName,
}: GetOpDataParams): string => {
  const opData = operationsData.operations[opName];

  // TODO handle case where a opId does not exist for the given opName
  if (opData === undefined) {
    throw new Error(
      `TODO handle case where an opId does not exist for the given opName. opName:${opName}`
    );
  }

  return opData.id;
};

const getOpRecordingIdFromWorkflow = async ({
  opId,
  workflowId,
}: GetRootTypeRecordingIdParams): Promise<string> => {
  const workflowData: WorkflowData | null = await getWorkflowById(workflowId);
  // TODO handle case where a workflow file is not found for the given workflowId
  if (workflowData === null) {
    throw new Error(
      `TODO handle case where a workflow file is not found for the given workflowId. workflowId:${workflowId}`
    );
  }

  const operationsWorkflowData = workflowData.operationRecordings[opId];
  // TODO handle case where the workflow file does not have a recording for the given opId
  if (!operationsWorkflowData) {
    throw new Error(
      `TODO handle case where the workflow file does not have a recording for the given opId. opId:${opId}`
    );
  }

  return operationsWorkflowData.opRecordingId;
};

// TODO handle args
// TODO optimization: should only need to do this once for all root level fields of the given query execution
//  * wait for semaphore access (only allows a single access at any given time) https://www.npmjs.com/package/await-semaphore
//  * after acquiring semaphore, check cache for resolved value
//  * If exists, release semaphore and return value
//  * Else, do the work below, set cache, release semaphore, and return value
export const fetchRootTypeRecording = async ({
  opName,
  operationsData,
  rootTypeName,
  typeNameToIdMappingData,
  workflowId,
}: FetchRootTypeRecordingParams) => {
  const opId = getOpIdFromOpName({
    operationsData,
    opName,
  });

  const opRecordingId = await getOpRecordingIdFromWorkflow({
    opId,
    workflowId,
  });

  const rootTypeId = await getTypeIdFromTypeName({
    typeName: rootTypeName,
    typeNameToIdMappingData,
  });

  const rootTypeRecordingId = await getRootTypeRecordingIdFromOpRecording({
    rootTypeId,
    opId,
    opRecordingId,
  });

  if (rootTypeRecordingId === null) {
    // TODO handle case where typeRecordingId does not exist for the given rootTypeId, opId, opRecordingId
    throw new Error(
      `TODO handle case where typeRecordingId does not exist for the given rootTypeId, opId, opRecordingId.
        rootTypeId:${rootTypeId}
        opId:${opId}
        opRecordingId:${opRecordingId}`
    );
  }

  const typeRecording = await getTypeRecording({
    typeId: rootTypeId,
    recordingId: rootTypeRecordingId,
  });
  return typeRecording.value;
};
