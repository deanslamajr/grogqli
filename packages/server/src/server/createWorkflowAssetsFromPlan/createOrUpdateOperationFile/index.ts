import { OperationRecordingPlan } from '../../graphql/schema/resolvers/mutations/createWorkflow';
import {
  createNewOperationRecordingsFile,
  addNewRecordingToOperationRecordingsFile,
  getOperationIdFromName,
  OperationRecordingWithoutId,
} from '../../files/operation';
import { createOpRecording } from './createOperationRecording';

type CreateOrUpdateOpFile = (
  opPlan: OperationRecordingPlan
) => Promise<{
  opId: string;
  opRecordingId;
}>;

export const createOrUpdateOpFile: CreateOrUpdateOpFile = async (opPlan) => {
  const opRecordingWithoutId: OperationRecordingWithoutId = await createOpRecording(
    {
      opPlan,
    }
  );

  let opRecordingId;
  let opId = await getOperationIdFromName({
    opName: opPlan.name!,
    schemaId: opPlan.schemaId,
  });

  if (opId === null) {
    ({ opId, opRecordingId } = await createNewOperationRecordingsFile({
      schemaId: opPlan.schemaId,
      opName: opPlan.name!,
      opRecordingWithoutId,
    }));
  } else {
    opRecordingId = await addNewRecordingToOperationRecordingsFile({
      opId,
      opRecordingWithoutId,
    });
  }

  return {
    opId,
    opRecordingId,
  };
};
