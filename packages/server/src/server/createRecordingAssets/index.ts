import {
  createRecorderApolloServer,
  RecordingsPlan,
} from './createRecorderApolloServer';

interface CreateRecordingAssets {
  operationResponseRecording: string;
  query: string;
  variables?: string;
}

export const createRecordingAssets = async ({
  operationResponseRecording,
  query,
  variables,
}: CreateRecordingAssets) => {
  const apolloServer = await createRecorderApolloServer({
    schemaId,
  });

  const parsedVariables = variables ? JSON.parse(variables) : undefined;

  // This will be mutated by apolloServer
  const recordingsPlan: RecordingsPlan = {
    typeRecordings: {},
  };

  await apolloServer.executeOperation({
    query,
    variables: {
      ...parsedVariables,
      grogqliRunTimeVariables: {
        operationResponseRecording,
        recordingsPlan,
      },
    },
  });
};
