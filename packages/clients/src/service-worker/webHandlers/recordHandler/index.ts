import {
  CreateTemporaryOperationRecording,
  UpdateTemporaryOperationRecording,
} from '@grogqli/schema';

import { get as getApolloClient } from '../../apolloClient';
import { getSessionId } from '../../handlerState';
import { DoWork, ResponseData, wrapWithBaseHandler } from '../baseHandler';
import { getSchemaMetaAndConditionallyRecordSchema } from './recordSchema';

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

  if (sessionId === null) {
    throw new Error('sessionId must be set before recording an operation.');
  }

  const {
    schemaHash,
    schemaUrl,
  } = await getSchemaMetaAndConditionallyRecordSchema({ req, ctx });

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
          url: schemaUrl,
          hash: schemaHash,
        },
        operationName: req.body!.operationName || 'unknownOperation',
        query: req.body!.query,
        sessionId,
        variables: req.body!.variables || {},
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
  const response: ResponseData = await fetchResponse.json();

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

  return response;
};

const recordHandler = wrapWithBaseHandler(recordOperation);
export default recordHandler;
