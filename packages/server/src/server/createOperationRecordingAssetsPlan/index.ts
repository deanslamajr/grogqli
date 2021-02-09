import { get as getTempOpRecording } from '../files/tempOpRecording';
import { UpdatedSchemasMapping } from '../files/schema';

import { OperationRecordingPlan } from './createRecorderApolloServer';
import { generateRecordingPlan } from './generateRecordingPlan';

type CreateOperationRecordingAssetsPlan = (params: {
  schemasMapping: UpdatedSchemasMapping[];
  sessionId: string;
  tempRecordingId: string;
}) => Promise<OperationRecordingPlan>;

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
    schemaHash: schemaHashFromOpRecording,
    variables,
  } = tempOpRecording;

  // @TODO improve/ prevent this case
  if (response === null || response === undefined) {
    throw new Error(`
      The temporary operation recording associated with
        sessionId:${sessionId}
        temporaryOperationRecordingId:${tempRecordingId}
      does not have an associated response.
    `);
  }

  const schemaMapping = schemasMapping.find(
    ({ schemaHash: schemaHashFromMapping }) =>
      schemaHashFromMapping === schemaHashFromOpRecording
  );
  if (schemaMapping === undefined) {
    throw new Error(
      `Could not find a schemaId mapping for the given schemaHash:${schemaHashFromOpRecording}`
    );
  }

  return generateRecordingPlan({
    parsedOpRecording: response,
    operationSDL,
    schemaId: schemaMapping.schemaId,
    variables,
  });
};
