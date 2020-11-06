import {
  getTypeRecording,
  getWorkflowById,
  TypeRecordingValue,
  WorkflowData,
} from '../../../files';

interface OperationsData {
  version: number;
  recordings: {
    [opName: string]: {
      opId: string;
      typeId: string;
    };
  };
}

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

const getOpData = ({
  operationsData,
  opName,
}: GetOpDataParams): GetOpDataResponse => {
  return operationsData.recordings[opName];
};

const getRootTypeRecordingId = async ({
  opId,
  workflowId,
}: GetRootTypeRecordingIdParams): Promise<string> => {
  const workflowData: WorkflowData | null = await getWorkflowById(workflowId);
  // TODO handle case where a workflow file is not found for the given workflowId
  if (workflowData === null) {
    throw new Error(
      'TODO handle case where a workflow file is not found for the given workflowId'
    );
  }
  const operationsWorkflowData = workflowData.recordings[opId];
  // TODO handle case where the workflow file does not have a recording for the given opId
  if (!operationsWorkflowData) {
    throw new Error(
      'TODO handle case where the workflow file does not have a recording for the given opId'
    );
  }

  return operationsWorkflowData.rootTypeRecordingId;
};

interface GetTypeRecordingValue {
  typeId: string;
  recordingId: string;
}
const getTypeRecordingValue = async (
  params: GetTypeRecordingValue
): Promise<TypeRecordingValue> => {
  const typeRecording = await getTypeRecording(params);
  return typeRecording.value;
};

export interface FetchRootTypeRecordingParams {
  opName: string;
  operationsData: OperationsData;
  workflowId: string;
}
export const fetchRootTypeRecording = async ({
  opName,
  operationsData,
  workflowId,
}: FetchRootTypeRecordingParams) => {
  // TODO optimization: should only need to do this once for all root level fields of the given query execution
  //  * wait for semaphore access (only allows a single access at any given time) https://www.npmjs.com/package/await-semaphore
  //  * after acquiring semaphore, check cache for resolved value
  //  * If exists, release semaphore and return value
  //  * Else, do the work below, set cache, release semaphore, and return value
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
