import { ApolloServerBase } from 'apollo-server-core';
import { buildClientSchema, printSchema, IntrospectionQuery } from 'graphql';

import { createResolvers } from './createResolvers';
import { getSchema, SchemaFile } from '../files';

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

const createSchemaSDL = async (schema: IntrospectionQuery): Promise<string> => {
  const graphqlSchemaObj = buildClientSchema(schema);
  return printSchema(graphqlSchemaObj);
};

export const createApolloServer = async ({
  schemaId,
}: CreateApolloServerParams): Promise<ApolloServerBase> => {
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
          // until at the time of query execution (eg workflowId) to the resolver closure
          runTimeVariables.grogqli = {
            ...requestContext.request?.variables?.grogqliRunTimeVariables,
          };
        },
      },
    ],
  });
};
