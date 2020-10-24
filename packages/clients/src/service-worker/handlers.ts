import {
  graphql,
  GraphQLMockedContext,
  GraphQLMockedRequest,
  GraphQLResponseResolver,
} from 'msw';
import { CreateRecording, RecordResponse } from '@grogqli/schema';
import { getIntrospectionQuery } from 'graphql';

import { getClient } from './ApolloClient';

import { serverUrl } from '../constants';

const { CreateRecordingDocument } = CreateRecording;
const { RecordResponseDocument } = RecordResponse;

const isRecording = true;
const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

interface ResponseData {
  data: any;
  errors: any;
}

interface FetchAndSaveSchemaParams {
  req: GraphQLMockedRequest<any>;
  ctx: GraphQLMockedContext<any>;
}

const fetchAndSaveSchema = async ({
  req,
  ctx,
}: FetchAndSaveSchemaParams): Promise<string> => {
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

  if (isRecording) {
    const apolloClient = getClient({
      url: serverUrl,
      fetch: ctx.fetch as WindowOrWorkerGlobalScope['fetch'],
    });

    // TODO Ensure that __typename fields are associated with every type on the query

    // TODO only do this once per session per schema
    const schemaFromIntrospection = await fetchAndSaveSchema({ req, ctx });

    let recordingId;
    // TODO refactor 'unknownOperation' case:
    // instead of unknownOperation, make this field optional and have the server handle this case
    // TODO refactor 'unknownQuery' case:
    // should this throw an error?
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
            operationName: req.body?.operationName || 'unknownOperation',
            query: req.body?.query || 'unknownQuery',
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

    // TODO use __typename fields in response payload to save the data associated with each type

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
    // - Parse the query from the original request
    //   - opName
    //   - ast
    //   - schemaUrl
    // - validate ast - validate the ast against the schema saved to disc
    //   - get the schema - get the local schema that maps to the given schemaUrl
    //   - error: schema doesn't exist - ???
    //   - error: invalid ast (could be invalid ast or invalid schema) - ???
    // - resolve the query with a graphql server
    //   - for every type on the schema, register the dynamic resolver (grogqli type resolver)
    //   - grogqli type resolver
    //     - when invoked, the resolver uses the query’s workflowId and opName to find and open the file associated with the recording for that type
    //     - error: if a recording for the given workflowId and opName doesn’t exist - ???
  }

  return res(ctx.data(responseData?.data || null));
};

type Handlers = [
  ReturnType<typeof graphql.query>,
  ReturnType<typeof graphql.mutation>
];

export const handlers: Handlers = [
  graphql.query(anyAlphaNumericStringReqExp, universalHandler),
  graphql.mutation(anyAlphaNumericStringReqExp, universalHandler),
];
