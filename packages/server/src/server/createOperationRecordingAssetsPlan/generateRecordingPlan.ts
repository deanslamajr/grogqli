import shortid from 'shortid';
import {
  createRecorderApolloServer,
  OperationRecordingPlan,
  RuntimeVariables,
  RootTypeRecordingsIds,
} from './createRecorderApolloServer';

type GenerateRootTypeRecordingsIds = () => RootTypeRecordingsIds;

export const generateRootTypeRecordingsIds: GenerateRootTypeRecordingsIds = () => {
  return {
    query: shortid.generate(),
    mutation: shortid.generate(),
    subscription: shortid.generate(),
  };
};

type GenerateRecordingPlan = (params: {
  parsedOpRecording: any;
  operationSDL: string;
  schemaHash: string;
  variables: any;
}) => Promise<OperationRecordingPlan>;

export const generateRecordingPlan: GenerateRecordingPlan = async ({
  parsedOpRecording,
  operationSDL,
  schemaHash,
  variables,
}) => {
  // TODO cascade the change from schemaId to schemaHash
  const apolloServer = await createRecorderApolloServer({
    schemaHash,
  });

  // This will be mutated by apolloServer
  const recordingsPlan: OperationRecordingPlan = {
    rootTypeRecordingIds: new Set(),
    schemaHash,
    typeRecordings: {},
  };
  const unusedRootTypeRecordingsIds = generateRootTypeRecordingsIds();
  const grogqliRunTimeVariables: RuntimeVariables = {
    parsedOpRecording,
    recordingsPlan,
    rootTypeRecordingsIds: unusedRootTypeRecordingsIds,
  };

  await apolloServer.executeOperation({
    query: operationSDL,
    variables: {
      ...variables,
      grogqliRunTimeVariables,
    },
  });

  return recordingsPlan;
};
