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
