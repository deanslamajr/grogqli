import { ApolloServerBase } from 'apollo-server-core';
import { buildClientSchema, printSchema, IntrospectionQuery } from 'graphql';

import { createResolvers } from './createResolvers';
import { getSchema, SchemaFile } from '../../files';

const createSchemaSDL = async (schema: IntrospectionQuery): Promise<string> => {
  const graphqlSchemaObj = buildClientSchema(schema);
  return printSchema(graphqlSchemaObj);
};

interface CreateApolloServerParams {
  schemaId: string;
}

interface RuntimeVariablesContainer {
  grogqli?: {
    opId: string;
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
          runTimeVariables.grogqli = {
            ...requestContext.request?.variables?.grogqliRunTimeVariables,
          };
        },
      },
    ],
  });
};
