import {
  CreateTemporaryOperationRecording,
  UpdateTemporaryOperationRecording,
} from '@grogqli/schema';

import { get as getApolloClient } from '../../apolloClient';
import { getSessionId } from '../../handlerState';
import { DoWork, ResponseData, wrapWithBaseHandler } from '../baseHandler';
import fetchSchema from './fetchSchema';

const {
  CreateTemporaryOperationRecordingDocument,
} = CreateTemporaryOperationRecording;
const {
  UpdateTemporaryOperationRecordingDocument,
} = UpdateTemporaryOperationRecording;

const recordOperation: DoWork = async (req, _res, ctx) => {
  const apolloClient = getApolloClient();
  const sessionId = getSessionId();
  let tempOpRecordingId;

  const schemaFromIntrospection = await fetchSchema({ req, ctx });

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
    tempOpRecordingId =
      createTemporaryOperationRecording?.createTemporaryOperationRecording
        .newRecording.id;
  }

  // Make the real request
  const fetchResponse = await ctx.fetch(req);
  const responseData: ResponseData = await fetchResponse.json();

  const response = JSON.stringify(responseData);

  if (tempOpRecordingId) {
    const { errors } = await apolloClient.mutate({
      mutation: UpdateTemporaryOperationRecordingDocument,
      variables: {
        input: {
          tempOpRecordingId,
          response,
          sessionId,
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
