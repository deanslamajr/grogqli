import { RecordingsPlan } from './createRecorderApolloServer';

import { generateRecordingPlan } from './generateRecordingPlan';
import { createRecordingAssetsFromPlan } from './createRecordingAssetsFromPlan';

type CreateRecordingAssets = (params: {
  operationResponseRecording: string;
  operationSDL: string;
  schemaId: string;
  variables?: string;
}) => Promise<void>;

export const createRecordingAssets: CreateRecordingAssets = async ({
  operationResponseRecording,
  operationSDL,
  schemaId,
  variables,
}) => {
  const parsedVariables = variables ? JSON.parse(variables) : undefined;
  const parsedOpRecording = JSON.parse(operationResponseRecording);

  const recordingsPlan: RecordingsPlan = await generateRecordingPlan({
    parsedOpRecording,
    operationSDL,
    schemaId,
    variables: parsedVariables,
  });

  // TODO implement createRecordingAssetsFromPlan
  await createRecordingAssetsFromPlan(recordingsPlan);
};
