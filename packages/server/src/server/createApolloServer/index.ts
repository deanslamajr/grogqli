import { ApolloServerBase } from 'apollo-server-core';

import { getSchemaRecordingFile, SchemaRecordingFile } from '../files/schema';
import { createSchemaSDL } from '../utils/createSchemaSDL';
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
  const schemaRecordingFile = await getSchemaRecordingFile(schemaId);
  if (schemaRecordingFile === null) {
    throw new Error(`
      Error while creating apollo server:
      Cannot find a file for a schema recording associated with the following schemaId:${schemaId}
    `);
  }

  const [schemaSDL, resolvers] = await Promise.all([
    createSchemaSDL(schemaRecordingFile.introspectionQuery),
    createResolvers(schemaRecordingFile),
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
