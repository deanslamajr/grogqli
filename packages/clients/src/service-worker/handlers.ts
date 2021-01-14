import {
  graphql,
  GraphQLMockedContext,
  GraphQLMockedRequest,
  GraphQLResponseResolver,
} from 'msw';
import {
  CreateRecording,
  PlaybackRecording,
  RecordResponse,
} from '@grogqli/schema';
import { getIntrospectionQuery } from 'graphql';

import { getClient } from './ApolloClient';

import { serverUrl } from '../constants';

const { CreateRecordingDocument } = CreateRecording;
const { RecordResponseDocument } = RecordResponse;
const { PlaybackRecordingDocument } = PlaybackRecording;

// TODO - replace with real data
const isRecording = false;

const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

interface ResponseData {
  data: any;
  errors: any;
}

interface FetchSchemaParams {
  req: GraphQLMockedRequest<any>;
  ctx: GraphQLMockedContext<any>;
}

// TODO add a version field to the schema datastructure
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

const universalHandler: GraphQLResponseResolver<any, any> = async (
  req,
  res,
  ctx
) => {
  let responseData: ResponseData = {
    data: null,
    errors: null,
  };

  const apolloClient = getClient({
    url: serverUrl,
    fetch: ctx.fetch as WindowOrWorkerGlobalScope['fetch'],
  });

  if (req.body === undefined) {
    throw new Error('Request body is undefined but this is invalid!');
  }
  if (req.body.query === undefined) {
    throw new Error('Request does not include a query!');
  }

  if (isRecording) {
    const schemaFromIntrospection = await fetchSchema({ req, ctx });

    let recordingId;

    // TODO refactor 'unknownOperation' case:
    // instead of unknownOperation, make this field optional and have the server handle this case

    const { data: createRecordingResponse, errors } = await apolloClient.mutate(
      {
        mutation: CreateRecordingDocument,
        variables: {
          input: {
            referrer: req.referrer,
            schema: {
              url: req.url.toString(),
              content: schemaFromIntrospection || null,
            },
            operationName: req.body.operationName || 'unknownOperation',
            query: req.body.query,
            variables: JSON.stringify(req.body?.variables),
          },
        },
      }
    );

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
      const { errors } = await apolloClient.mutate({
        mutation: RecordResponseDocument,
        variables: {
          input: {
            recordingId,
            response,
          },
        },
      });

      if (errors) {
        errors.forEach(error => console.error(error));
      }
    }
  } else {
    const { data, errors } = await apolloClient.mutate({
      mutation: PlaybackRecordingDocument,
      variables: {
        input: {
          schemaId: 'test',
          workflowId: 'ITD_Tk6hwo7',
          query: req.body.query,
          variables: req.body.variables
            ? JSON.stringify(req.body.variables)
            : null,
        },
      },
    });

    if (errors && errors.length) {
      errors.forEach(error => console.error(error));
    }

    let dataFromPlayback;
    let errorsFromPlayback;
    if (data?.playbackRecording) {
      dataFromPlayback =
        data.playbackRecording.data !== null
          ? JSON.parse(data.playbackRecording.data)
          : null;
      errorsFromPlayback =
        data.playbackRecording.errors !== null
          ? JSON.parse(data.playbackRecording.errors)
          : null;
    }

    responseData = {
      data: dataFromPlayback,
      errors: errorsFromPlayback,
    };
  }

  // TODO find a way to respond errors and data in same response
  const response = responseData?.errors
    ? ctx.errors(responseData.errors)
    : responseData?.data
    ? ctx.data(responseData.data)
    : ctx.data(null);

  return res(response);
};

type Handlers = [
  ReturnType<typeof graphql.query>,
  ReturnType<typeof graphql.mutation>
];

export const handlers: Handlers = [
  graphql.query(anyAlphaNumericStringReqExp, universalHandler),
  graphql.mutation(anyAlphaNumericStringReqExp, universalHandler),
];
