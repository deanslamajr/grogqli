import { getSchema, SchemaFile } from '../../files';
import { createSchemaSDL } from '../../createSchemaSDL';

import { createResolvers } from './createResolvers';

type CreateRecorderApolloServer = (params: {
  schemaId: string;
}) => Promise<void>;

interface RuntimeVariablesContainer {
  grogqli?: {
    operationResponseRecording: string;
    recordingsPlan: RecordingsPlan;
  };
}

export interface Context {
  schemaId: string;
  runTimeVariables: RuntimeVariablesContainer;
}

export interface RecordingsPlan {
  typeRecordings: {
    [typeName: string]: {
      recordingId: string;
      value: any;
    };
  };
}

export const createRecorderApolloServer: CreateRecorderApolloServer = async ({
  schemaId,
}) => {
  const schemaFile: SchemaFile = await getSchema(schemaId);

  const [schemaSDL, resolvers] = await Promise.all([
    createSchemaSDL(schemaFile.introspectionQuery),
    createResolvers(schemaFile),
  ]);

  const runTimeVariables = {} as RuntimeVariablesContainer;

  const context: Context = { schemaId, runTimeVariables };

  return new ApolloServerBase({
    resolvers,
    typeDefs: schemaSDL,
    context,
    plugins: [
      {
        requestDidStart(requestContext) {
          // Inject runtime variables for resolvers
          // TODO find a less hacky way to communicate data that is not known
          // until at the time of query execution (eg operationResponseRecording) to the resolver closure
          runTimeVariables.grogqli = {
            ...requestContext.request?.variables?.grogqliRunTimeVariables,
          };
        },
      },
    ],
  });
};
