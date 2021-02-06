import { GraphQLMockedContext, GraphQLMockedRequest } from 'msw';
import { getIntrospectionQuery } from 'graphql';
import memoize from 'memoizee';

interface FetchSchemaParams {
  req: GraphQLMockedRequest<any>;
  ctx: GraphQLMockedContext<any>;
}

const memoizedFetchAndRecordSchema = memoize(
  async (
    _schemaUrl: string, // provided for memoize cache key, req has its own reference to this
    { req, ctx }: FetchSchemaParams
  ) => {
    const introspectionReq = { ...req, body: {} };
    introspectionReq.body = JSON.stringify({
      query: getIntrospectionQuery(),
    });
    const introspectionRequestResult = await ctx.fetch(introspectionReq);
    const introspectionResult = await introspectionRequestResult.json();

    // TODO:
    // invoke recordSchema mutation

    // TODO return schemaHash and schemaUrl
    return JSON.stringify(introspectionResult.data, null, 2);
  },
  {
    length: 1, // only key the cache on the first argument ie. schemaUrl
    promise: true, // don't cache rejected promises
  }
);

type GetSchemaMetaAndConditionallyRecordSchema = (
  params: FetchSchemaParams
) => Promise<string>;

export const getSchemaMetaAndConditionallyRecordSchema: GetSchemaMetaAndConditionallyRecordSchema = ({
  req,
  ctx,
}) => {
  const schemaUrl = req.url.toString();
  return memoizedFetchAndRecordSchema(schemaUrl, { req, ctx });
};
