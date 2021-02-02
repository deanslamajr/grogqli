import { get as getTempOpRecording } from '../files/tempOpRecording';

import { OperationRecordingPlan } from './createRecorderApolloServer';
import { generateRecordingPlan } from './generateRecordingPlan';

type CreateOperationRecordingAssetsPlan = (params: {
  schemasMapping: SchemasMapping;
  sessionId: string;
  tempRecordingId: string;
}) => Promise<OperationRecordingPlan>;

export type SchemasMapping = Array<{
  id: string;
  url: string;
}>;

export const createOperationRecordingAssetsPlan: CreateOperationRecordingAssetsPlan = async ({
  schemasMapping,
  sessionId,
  tempRecordingId,
}) => {
  const tempOpRecording = await getTempOpRecording({
    sessionId,
    temporaryOperationRecordingId: tempRecordingId,
  });

  const {
    response,
    query: operationSDL,
    tempSchemaRecordingId,
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
    schemaId: tempSchemaRecordingId,
    variables,
  });
};
