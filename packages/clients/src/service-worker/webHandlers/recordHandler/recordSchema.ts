import { GraphQLMockedContext, GraphQLMockedRequest } from 'msw';
import { getIntrospectionQuery } from 'graphql';
import memoize from 'memoizee';
import { CreateSchemaRecording } from '@grogqli/schema';

import { get as getApolloClient } from '../../apolloClient';

interface FetchSchemaParams {
  req: GraphQLMockedRequest<any>;
  ctx: GraphQLMockedContext<any>;
}

const memoizedFetchAndRecordSchema = memoize(
  async (schemaUrl: string, { req, ctx }: FetchSchemaParams) => {
    const introspectionReq = { ...req, body: {} };
    introspectionReq.body = JSON.stringify({
      query: getIntrospectionQuery(),
    });
    const introspectionRequestResult = await ctx.fetch(introspectionReq);
    const introspectionRequestResultJson = await introspectionRequestResult.json();

    if (
      !introspectionRequestResultJson ||
      !introspectionRequestResultJson.data
    ) {
      throw new Error(
        `Unexpected response from the schema introspection query:${introspectionRequestResultJson}`
      );
    }

    const apolloClient = getApolloClient();
    const { data, errors } = await apolloClient.mutate({
      mutation: CreateSchemaRecording.CreateSchemaRecordingDocument,
      variables: {
        input: {
          schemaIntrospectionResult: introspectionRequestResultJson.data,
        },
      },
    });

    if (errors && errors.length) {
      throw errors[0];
    }
    if (data === null || data === undefined) {
      throw new Error(
        'CreateSchemaRecording mutation returned without error but without any data!'
      );
    }

    const {
      createSchemaRecording: { schemaHash },
    } = data;

    return {
      schemaHash,
      schemaUrl,
    };
  },
  {
    length: 1, // only key the cache on the first argument ie. schemaUrl
    promise: true, // don't cache rejected promises
  }
);

type GetSchemaMetaAndConditionallyRecordSchema = (
  params: FetchSchemaParams
) => Promise<{
  schemaHash: string;
  schemaUrl: string;
}>;

export const getSchemaMetaAndConditionallyRecordSchema: GetSchemaMetaAndConditionallyRecordSchema = ({
  req,
  ctx,
}) => {
  const schemaUrl = req.url.toString();
  return memoizedFetchAndRecordSchema(schemaUrl, { req, ctx });
};
