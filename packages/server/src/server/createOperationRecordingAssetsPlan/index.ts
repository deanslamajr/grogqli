import { Recording } from '@grogqli/schema';

import { getQueryRecordingsFile } from '../files';
import { OperationRecordingPlan } from './createRecorderApolloServer';
import { generateRecordingPlan } from './generateRecordingPlan';

type CreateOperationRecordingAssetsPlan = (params: {
  tempRecordingId: string;
}) => Promise<OperationRecordingPlan>;

export const createOperationRecordingAssetsPlan: CreateOperationRecordingAssetsPlan = async ({
  tempRecordingId,
}) => {
  const file = await getQueryRecordingsFile();
  const recording: Recording = file.get(tempRecordingId);
  if (!recording) {
    throw new Error(
      `Temporary recording with id:${tempRecordingId} does not exist!`
    );
  }

  const {
    response,
    query: operationSDL,
    // TODO refactor webapp to set the schemaId in the recording
    schemaId,
    variables: rawVariables,
  } = recording;

  if (response === null || response === undefined) {
    throw new Error(
      `Recording with id:${tempRecordingId} has a null/undefined response value.`
    );
  }

  const variables = rawVariables ? JSON.parse(rawVariables) : undefined;
  const parsedOpRecording = JSON.parse(response);

  return generateRecordingPlan({
    parsedOpRecording,
    operationSDL,
    schemaId,
    variables,
  });
};
