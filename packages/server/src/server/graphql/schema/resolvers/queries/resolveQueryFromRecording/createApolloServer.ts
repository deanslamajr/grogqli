import { ApolloServerBase } from 'apollo-server-core';
import { buildClientSchema, printSchema, IntrospectionQuery } from 'graphql';
import fs from 'fs';
import path from 'path';

import { getSchemaRecordingsPath } from '../../files';
import { createResolvers } from './createResolvers';

const getSchema = async (schemaId: string): Promise<IntrospectionQuery> => {
  const schemaRecordingsPath = await getSchemaRecordingsPath();
  return JSON.parse(
    fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  );
};

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
  const schema: IntrospectionQuery = await getSchema(schemaId);
  const schemaSDL = await createSchemaSDL(schema);
  const resolvers = createResolvers(schema);

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
