import { OperationRecordingPlan } from '../../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import {
  createNewOpFile,
  getOpFileFromOpName,
  OperationFile,
  OperationRecording,
} from '../../files/operation';
import { createOpRecording } from './createOperationRecording';

type CreateOrUpdateOpFile = (params: {
  opPlan: OperationRecordingPlan;
}) => Promise<{
  opFile: OperationFile;
  opRecording: OperationRecording;
}>;

export const createOrUpdateOpFile: CreateOrUpdateOpFile = async ({
  opPlan,
}) => {
  const opRecording: OperationRecording = await createOpRecording({
    opPlan,
  });

  let opFile = await getOpFileFromOpName({
    schemaId: opPlan.schemaId,
    opName: opPlan.name!,
  });

  if (opFile === null) {
    opFile = createNewOpFile({
      schemaId: opPlan.schemaId,
      opName: opPlan.name!,
    });
  }
  opFile.recordings[opRecording.id] = opRecording;
  // TODO save opFile
  return {
    opFile,
    opRecording,
  };
};
