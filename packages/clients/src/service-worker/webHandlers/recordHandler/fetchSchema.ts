import { GraphQLMockedContext, GraphQLMockedRequest } from 'msw';
import { getIntrospectionQuery } from 'graphql';

interface FetchSchemaParams {
  req: GraphQLMockedRequest<any>;
  ctx: GraphQLMockedContext<any>;
}

const fetchSchema = async ({
  req,
  ctx,
}: FetchSchemaParams): Promise<string> => {
  const introspectionReq = { ...req, body: {} };
  introspectionReq.body = JSON.stringify({
    query: getIntrospectionQuery(),
  });

  const introspectionRequestResult = await ctx.fetch(introspectionReq);
  const introspectionResult = await introspectionRequestResult.json();
  return JSON.stringify(introspectionResult.data, null, 2);
};

export default fetchSchema;
