import shortid from 'shortid';
import {
  createRecorderApolloServer,
  RecordingsPlan,
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
  schemaId: string;
  variables: any;
}) => Promise<RecordingsPlan>;

export const generateRecordingPlan: GenerateRecordingPlan = async ({
  parsedOpRecording,
  operationSDL,
  schemaId,
  variables,
}) => {
  // This will be mutated by apolloServer
  const recordingsPlan: RecordingsPlan = {
    typeRecordings: {},
  };

  // TODO add plan data for
  // * operation
  // * workflow
  // * args
  // * etc.

  const rootTypeRecordingsIds = generateRootTypeRecordingsIds();

  const apolloServer = await createRecorderApolloServer({
    schemaId,
  });

  await apolloServer.executeOperation({
    query: operationSDL,
    variables: {
      ...variables,
      grogqliRunTimeVariables: {
        parsedOpRecording,
        recordingsPlan,
        rootTypeRecordingsIds,
      } as RuntimeVariables,
    },
  });

  return recordingsPlan;
};
