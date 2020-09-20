import { graphql, GraphQLResponseResolver } from 'msw';
import shortid from 'shortid';

import { groqlServerPort } from '../constants';

const groqlServerHost = `localhost:${groqlServerPort}`;

const isRecording = true;
const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

const universalHandler: GraphQLResponseResolver<any, any> = async (
  req,
  res,
  ctx
) => {
  let responseData = {
    data: null,
    errors: null,
  };

  if (isRecording) {
    const recordingId = shortid.generate();
    await ctx.fetch(`http://${groqlServerHost}/recording/${recordingId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const fetchResponse = await ctx.fetch(req);
    responseData = await fetchResponse.json();    

    await ctx.fetch(`http://${groqlServerHost}/recording/${recordingId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    });
  } else {
    console.log('req', req);
    // const response = await ctx.fetch(`http://${groqlServerHost}/mock/${}`)
    const taco = await ctx.fetch(`http://${groqlServerHost}/mock`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: req.body,
        url: req.url.toString(),
      }),
    });

    console.log('taco', taco);
  }

  return res(ctx.data(responseData?.data || null));
};

type Handlers = [
  ReturnType<typeof graphql.query>,
  ReturnType<typeof graphql.mutation>
]

export const handlers: Handlers = [
  graphql.query(anyAlphaNumericStringReqExp, universalHandler),
  graphql.mutation(anyAlphaNumericStringReqExp, universalHandler),
];
