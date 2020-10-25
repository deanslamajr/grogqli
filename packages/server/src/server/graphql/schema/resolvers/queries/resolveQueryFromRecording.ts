import {
  ApolloServerBase,
  Config,
  GraphQLRequest,
  GraphQLResponse,
} from 'apollo-server-core';
import { buildClientSchema, printSchema } from 'graphql';
import fs from 'fs';
import path from 'path';

import { getSchemaRecordingsPath } from '../files';

const createSchemaSDL = async (): Promise<string> => {
  const schemaRecordingsPath = await getSchemaRecordingsPath();
  const introspectionSchemaResult = JSON.parse(
    fs.readFileSync(path.join(schemaRecordingsPath, 'test.json'), 'utf8')
  );
  const graphqlSchemaObj = buildClientSchema(introspectionSchemaResult);
  return printSchema(graphqlSchemaObj);
};

const createResolvers = () => {
  return {
    Query: {
      getChores() {
        return {
          chores: null,
          hasAccountSession: true,
        };
      },
    },
  };
};

export interface ResolveQueryFromRecordingParams {
  query: string;
}

export interface ResolveQueryFromRecordingResponse {
  data: GraphQLResponse['data'];
  errors: GraphQLResponse['errors'];
}

export const resolveQueryFromRecording = async (
  params: ResolveQueryFromRecordingParams
): Promise<ResolveQueryFromRecordingResponse> => {
  const schemaSDL = await createSchemaSDL();
  const resolvers = createResolvers();
  const config: Config = { resolvers, typeDefs: schemaSDL };
  const apolloServer = new ApolloServerBase(config);

  const request: GraphQLRequest = {
    query: params.query,
  };
  const response = await apolloServer.executeOperation(request);

  return {
    data: response.data,
    errors: response.errors,
  };
};
