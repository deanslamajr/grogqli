import { Recording } from '@grogqli/schema';

import { getTempOpRecordingFileName } from '../files';
import { OperationRecordingPlan } from './createRecorderApolloServer';
import { generateRecordingPlan } from './generateRecordingPlan';

type CreateOperationRecordingAssetsPlan = (params: {
  schemasMapping: SchemasMapping;
  tempRecordingId: string;
}) => Promise<OperationRecordingPlan>;

export type SchemasMapping = Array<{
  id: string;
  url: string;
}>;

export const createOperationRecordingAssetsPlan: CreateOperationRecordingAssetsPlan = async ({
  schemasMapping,
  tempRecordingId,
}) => {
  const file = await getTempOpRecordingFileName();
  const recording: Recording = file.get(tempRecordingId);
  if (!recording) {
    throw new Error(
      `Temporary recording with id:${tempRecordingId} does not exist!`
    );
  }

  const {
    response,
    query: operationSDL,
    schemaUrl,
    variables: rawVariables,
  } = recording;

  const schema = schemasMapping.find(({ url }) => schemaUrl === url);
  if (schema === undefined) {
    throw new Error(
      `Could not find a schemaId mapping for the given schemaUrl:${schemaUrl}`
    );
  }

  if (response === null || response === undefined) {
    throw new Error(
      `Recording with id:${tempRecordingId} has a null/undefined response value.`
    );
  }

  const variables = rawVariables ? JSON.parse(rawVariables) : undefined;
  const parsedOpRecording = JSON.parse(response);

  return generateRecordingPlan({
    parsedOpRecording,
    operationSDL,
    schemaId: schema.id,
    variables,
  });
};
