import { get as getTempOpRecording } from '../files/tempOpRecording';
import { OperationRecordingPlan } from './createRecorderApolloServer';
import { generateRecordingPlan } from './generateRecordingPlan';

type CreateOperationRecordingAssetsPlan = (params: {
  sessionId: string;
  tempRecordingId: string;
}) => Promise<OperationRecordingPlan>;

export const createOperationRecordingAssetsPlan: CreateOperationRecordingAssetsPlan = async ({
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
    schemaHash: schemaHashFromTempOpRecording,
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

  // TODO
  //  * have the resolver functions in apolloServer.executeOperation parse args and include in the generated plan
  //    * this will provide SaveDrawer with the args data at the correct nesting
  //  * add schema to @grogqli/schema

  return generateRecordingPlan({
    parsedOpRecording: response,
    operationSDL,
    schemaHash: schemaHashFromTempOpRecording,
    variables,
  });
};
