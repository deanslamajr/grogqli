import { graphql, GraphQLResponseResolver } from 'msw';
import {CreateRecording, RecordResponse} from '@grogqli/schema';

import {getClient} from './ApolloClient';

import { serverUrl } from '../constants';

const {CreateRecordingDocument} = CreateRecording;
const {RecordResponseDocument} = RecordResponse;

const isRecording = true;
const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

interface ResponseData {
  data: any;
  errors: any;
}

const universalHandler: GraphQLResponseResolver<any, any> = async (
  req,
  res,
  ctx
) => {
  let responseData: ResponseData = {
    data: null,
    errors: null,
  };

  if (isRecording) {
    const apolloClient = getClient({
      url: serverUrl,
      fetch: ctx.fetch as WindowOrWorkerGlobalScope['fetch']
    });

    let recordingId;
    const {data: createRecordingResponse, errors} = await apolloClient.mutate({
      mutation: CreateRecordingDocument,
      variables: {
        input: {
          operationName: req.body?.operationName || 'unknownOperation',
          query: req.body?.query || 'unknownQuery',
          variables: JSON.stringify(req.body?.variables)
        }
      }
    });

    if (errors) {
      errors.forEach(error => console.error(error));
    } else {
      recordingId = createRecordingResponse?.createRecording.newRecording.id;
    }

    // Make the real request
    const fetchResponse = await ctx.fetch(req);
    responseData = await fetchResponse.json();

    const response = JSON.stringify(responseData);

    if (recordingId) {
      const {errors} = await apolloClient.mutate({
        mutation: RecordResponseDocument,
        variables: {
          input: {
            recordingId,
            response
          }
        }
      });
  
      if (errors) {
        errors.forEach(error => console.error(error));
      }
    }

    // await ctx.fetch(`${serverUrl}/recording/${recordingId}`, {
    //   method: 'PUT',
    //   headers: {
    //     Accept: 'application/json, text/plain, */*',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(responseData),
    // });
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
