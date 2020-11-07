import {
  getTypeRecording,
  getWorkflowById,
  OperationsData,
  TypeRecordingValue,
  WorkflowData,
} from '../../../files';

interface GetOpDataParams {
  operationsData: OperationsData;
  opName: string;
}

interface GetOpDataResponse {
  opId: string;
  typeId: string;
}

interface GetRootTypeRecordingIdParams {
  opId: string;
  workflowId: string;
}

interface GetTypeRecordingValue {
  typeId: string;
  recordingId: string;
}

export interface FetchRootTypeRecordingParams {
  opName: string;
  operationsData: OperationsData;
  workflowId: string;
}

const getOpData = ({
  operationsData,
  opName,
}: GetOpDataParams): GetOpDataResponse => {
  const operationRecording = operationsData.recordings[opName];

  // TODO handle case where a recording does not exist for the given opName
  if (operationRecording === undefined) {
    throw new Error(
      `TODO handle case where a recording does not exist for the given opName. opName:${opName}`
    );
  }

  return operationRecording;
};

const getRootTypeRecordingId = async ({
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

  const operationsWorkflowData = workflowData.recordings[opId];
  // TODO handle case where the workflow file does not have a recording for the given opId
  if (!operationsWorkflowData) {
    throw new Error(
      `TODO handle case where the workflow file does not have a recording for the given opId. opId:${opId}`
    );
  }

  return operationsWorkflowData.rootTypeRecordingId;
};

const getTypeRecordingValue = async (
  params: GetTypeRecordingValue
): Promise<TypeRecordingValue> => {
  const typeRecording = await getTypeRecording(params);
  return typeRecording.value;
};

export const fetchRootTypeRecording = async ({
  opName,
  operationsData,
  workflowId,
}: FetchRootTypeRecordingParams) => {
  const { opId, typeId: rootTypeId } = getOpData({ operationsData, opName });
  const rootTypeRecordingId = await getRootTypeRecordingId({
    opId,
    workflowId,
  });
  return getTypeRecordingValue({
    typeId: rootTypeId,
    recordingId: rootTypeRecordingId,
  });
};
