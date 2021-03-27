import {
  getTypeIdFromTypeName,
  getTypeRecording,
  TypeNameToIdMapping,
} from '../../files/type';
import {
  getWorkflowById,
  WorkflowRecordingsFile,
  WorkflowRecordingsFileVersion1,
} from '../../files/workflow';
import {
  getOperationFile,
  OperationRecordingsFileVersion1,
  OperationNameToIdMapping,
} from '../../files/operation';

interface GetOpDataParams {
  operationsData: OperationNameToIdMapping;
  opName: string;
}

interface GetRootTypeRecordingIdParams {
  opId: string;
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
  const workflowData: WorkflowRecordingsFile | null = await getWorkflowById(
    workflowId
  );
  // TODO handle case where a workflow file is not found for the given workflowId
  if (workflowData === null) {
    throw new Error(
      `TODO handle case where a workflow file is not found for the given workflowId. workflowId:${workflowId}`
    );
  }

  const operationsWorkflowData = (workflowData as WorkflowRecordingsFileVersion1)
    .operationRecordings[opId];
  // TODO handle case where the workflow file does not have a recording for the given opId
  if (!operationsWorkflowData) {
    throw new Error(
      `TODO handle case where the workflow file does not have a recording for the given opId. opId:${opId}`
    );
  }

  return operationsWorkflowData.opRecordingId;
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
  const opFile: OperationRecordingsFileVersion1 | null = await getOperationFile(
    opId
  );

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

export interface FetchRootTypeRecordingParams {
  opName: string;
  operationsData: OperationNameToIdMapping;
  rootTypeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
  workflowId: string;
}

// TODO handle args
// TODO optimization: should only need to do this once for a given root type on a given operation
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
  // TODO handle the case where the given typeName does not exist in the given schemaId's types.json
  if (rootTypeId === null) {
    throw new Error(`
      TODO handle the case where the given typeName does not exist in the given types.json.
      rootTypeName:${rootTypeName}
    `);
  }

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

  return await getTypeRecording({
    typeId: rootTypeId,
    recordingId: rootTypeRecordingId,
  });
};
