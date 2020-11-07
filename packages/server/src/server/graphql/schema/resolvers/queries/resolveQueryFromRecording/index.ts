import { GraphQLResponse } from 'apollo-server-core';

import { createApolloServer } from './createApolloServer';

export interface ResolveQueryFromRecordingParams {
  query: string;
  schemaId: string;
  workflowId: string;
  opId: string;
}

export interface ResolveQueryFromRecordingResponse {
  data: GraphQLResponse['data'];
  errors: GraphQLResponse['errors'];
}

export const resolveQueryFromRecording = async ({
  query,
  opId = 'someOpId',
  schemaId = 'test', // TODO remove this default
  workflowId = 'someWorkflowId',
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
        opId,
      },
    },
  });

  return {
    data: response.data,
    errors: response.errors,
  };
};
