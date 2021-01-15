import { GraphQLMockedRequest, GraphQLMockedContext } from 'msw';

export interface ResponseData {
  data: any;
  errors: any;
}

export type DoWork = (
  req: GraphQLMockedRequest,
  res: any,
  ctx: GraphQLMockedContext<any>
) => Promise<ResponseData>;

// GraphQLResponseResolver<any, any>
export const wrapWithBaseHandler = (doWork: DoWork) => async (
  req,
  res,
  ctx
) => {
  if (req.body === undefined) {
    throw new Error('Request body is undefined but this is invalid!');
  }
  if (req.body.query === undefined) {
    throw new Error('Request does not include a query!');
  }

  const responseData: ResponseData = await doWork(req, res, ctx);

  // TODO find a way to respond errors and data in same response
  const response = responseData?.errors
    ? ctx.errors(responseData.errors)
    : responseData?.data
    ? ctx.data(responseData.data)
    : ctx.data(null);

  return res(response);
};
