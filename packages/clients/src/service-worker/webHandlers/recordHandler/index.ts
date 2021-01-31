import {
  CreateTemporaryOperationRecording,
  RecordResponse,
} from '@grogqli/schema';

import { get as getApolloClient } from '../../apolloClient';
import { DoWork, ResponseData, wrapWithBaseHandler } from '../baseHandler';
import fetchSchema from './fetchSchema';

const {
  CreateTemporaryOperationRecordingDocument,
} = CreateTemporaryOperationRecording;
const { RecordResponseDocument } = RecordResponse;

const recordOperation: DoWork = async (req, _res, ctx) => {
  const apolloClient = getApolloClient();

  const schemaFromIntrospection = await fetchSchema({ req, ctx });

  const sessionId = 'mockSessionId';

  const cacheExtract = apolloClient.cache.extract();
  console.log('cacheExtract', cacheExtract);

  let recordingId;

  // TODO refactor 'unknownOperation' case:
  // instead of unknownOperation, make this field optional and have the server handle this case
  const {
    data: createTemporaryOperationRecording,
    errors,
  } = await apolloClient.mutate({
    mutation: CreateTemporaryOperationRecordingDocument,
    variables: {
      input: {
        referrer: req.referrer,
        schema: {
          url: req.url.toString(),
          content: schemaFromIntrospection || null,
        },
        operationName: req.body!.operationName || 'unknownOperation',
        query: req.body!.query,
        sessionId,
        variables: JSON.stringify(req.body?.variables),
      },
    },
  });

  if (errors) {
    errors.forEach((error) => console.error(error));
  } else {
    recordingId =
      createTemporaryOperationRecording?.createTemporaryOperationRecording
        .newRecording.id;
  }

  // Make the real request
  const fetchResponse = await ctx.fetch(req);
  const responseData: ResponseData = await fetchResponse.json();

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
      errors.forEach((error) => console.error(error));
    }
  }

  return responseData;
};

const recordHandler = wrapWithBaseHandler(recordOperation);
export default recordHandler;
