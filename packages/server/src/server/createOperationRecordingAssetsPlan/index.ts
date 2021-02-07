import { SchemasMappingsInput } from '@grogqli/schema';

import { get as getTempOpRecording } from '../files/tempOpRecording';

import { OperationRecordingPlan } from './createRecorderApolloServer';
import { generateRecordingPlan } from './generateRecordingPlan';

type CreateOperationRecordingAssetsPlan = (params: {
  schemasMapping: SchemasMappingsInput[];
  sessionId: string;
  tempRecordingId: string;
}) => Promise<OperationRecordingPlan>;

export const createOperationRecordingAssetsPlan: CreateOperationRecordingAssetsPlan = async ({
  schemasMapping,
  sessionId,
  tempRecordingId,
}) => {
  console.log('schemasMapping', schemasMapping);

  const tempOpRecording = await getTempOpRecording({
    sessionId,
    temporaryOperationRecordingId: tempRecordingId,
  });

  const {
    response,
    query: operationSDL,
    schemaHash,
    schemaUrl,
    variables: rawVariables,
  } = tempOpRecording;

  // @TODO handle/prevent case where response === null
  if (response === null) {
    throw new Error(`
      The temporary operation recording associated with
        sessionId:${sessionId}
        temporaryOperationRecordingId:${tempRecordingId}
      does not have an associated response.
    `);
  }

  // @TODO uncomment and refactor to support a better UX
  //
  //
  // const schema = schemasMapping.find(({ url }) => schemaUrl === url);
  // if (schema === undefined) {
  //   throw new Error(
  //     `Could not find a schemaId mapping for the given schemaUrl:${schemaUrl}`
  //   );
  // }

  // if (response === null || response === undefined) {
  //   throw new Error(
  //     `Recording with id:${tempRecordingId} has a null/undefined response value.`
  //   );
  // }

  const variables = rawVariables ? JSON.parse(rawVariables) : undefined;
  const parsedOpRecording = JSON.parse(response);

  return generateRecordingPlan({
    parsedOpRecording,
    operationSDL,
    schemaId: '',
    variables,
  });
};
