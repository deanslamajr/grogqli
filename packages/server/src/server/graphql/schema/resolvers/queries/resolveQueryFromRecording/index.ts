import { GraphQLResponse } from 'apollo-server-core';

import { createApolloServer } from './createApolloServer';

export interface ResolveQueryFromRecordingParams {
  query: string;
  schemaId: string;
  workflowId: string;
}

export interface ResolveQueryFromRecordingResponse {
  data: GraphQLResponse['data'];
  errors: GraphQLResponse['errors'];
}

export const resolveQueryFromRecording = async ({
  query,
  schemaId,
  workflowId,
}: ResolveQueryFromRecordingParams): Promise<
  ResolveQueryFromRecordingResponse
> => {
  // TODO do this work a single time at server start
  // will need to provide a way to manually "reinitialize" these whenever any of the static data is changed
  // eg the schema file is updated as part of a mutation)
  const apolloServer = await createApolloServer({
    schemaId,
  });

  const response = await apolloServer.executeOperation({
    query,
    variables: {
      grogqliRunTimeVariables: {
        workflowId,
      },
    },
  });

  return {
    data: response.data,
    errors: response.errors,
  };
};
