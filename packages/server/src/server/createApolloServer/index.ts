import { ApolloServerBase } from 'apollo-server-core';

import { getSchemaRecordingFile, SchemaRecording } from '../files/schema';
import { createSchemaSDL } from '../createSchemaSDL';
import { createResolvers } from './createResolvers';

interface CreateApolloServerParams {
  schemaId: string;
}

interface RuntimeVariablesContainer {
  grogqli?: {
    workflowId: string;
  };
}

export interface Context {
  schemaId: string;
  runTimeVariables: RuntimeVariablesContainer;
}

export const createApolloServer = async ({
  schemaId,
}: CreateApolloServerParams): Promise<ApolloServerBase> => {
  const schemaFile: SchemaRecording = await getSchemaRecordingFile(schemaId);

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
          // until at the time of query execution (eg workflowId) to the resolver closure
          runTimeVariables.grogqli = {
            ...requestContext.request?.variables?.grogqliRunTimeVariables,
          };
        },
      },
    ],
  });
};
