import { graphql, GraphQLResponseResolver } from 'msw';
import shortid from 'shortid';
import {CreateRecording} from '@grogqli/schema';

import {getClient} from './ApolloClient';

import { serverUrl } from '../constants';

const {CreateRecordingDocument} = CreateRecording;

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
    const apolloClient = getClient({
      url: serverUrl,
      fetch: ctx.fetch as WindowOrWorkerGlobalScope['fetch']
    });

    const recordingId = shortid.generate();
    await apolloClient.mutate({
      mutation: CreateRecordingDocument,
      variables: {
        input: {
          operationName: req.body?.operationName,
          query: req.body?.query,
          variables: JSON.stringify(req.body?.variables)
        }
      }
    });

    const fetchResponse = await ctx.fetch(req);
    responseData = await fetchResponse.json();    

    await ctx.fetch(`${serverUrl}/recording/${recordingId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    });
  } else {
    console.log('not recording');
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
