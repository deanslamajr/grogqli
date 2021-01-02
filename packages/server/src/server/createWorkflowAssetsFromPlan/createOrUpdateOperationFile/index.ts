import { OperationRecordingPlan } from '../../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import {
  createNewOperationRecordingsFile,
  getOperationIdFromName,
  OperationRecordingWithoutId,
} from '../../files/operation';
import { createOpRecording } from './createOperationRecording';

type CreateOrUpdateOpFile = (params: {
  opPlan: OperationRecordingPlan;
}) => Promise<{
  opId: string;
  opRecordingId;
  // opFile: OperationRecordingsFileVersion1;
  // opRecording: OperationRecording;
}>;

export const createOrUpdateOpFile: CreateOrUpdateOpFile = async ({
  opPlan,
}) => {
  const opRecordingWithoutId: OperationRecordingWithoutId = await createOpRecording(
    {
      opPlan,
    }
  );

  let opId = await getOperationIdFromName({
    opName: opPlan.name!,
    schemaId: opPlan.schemaId,
  });

  let opRecordingId;
  if (opId === null) {
    ({ opId, opRecordingId } = await createNewOperationRecordingsFile({
      schemaId: opPlan.schemaId,
      opName: opPlan.name!,
      opRecordingWithoutId,
    }));
  } else {
    opRecordingId = await addNewRecordingToOperationRecordingsFile({
      opPlan,
      opId,
      opRecordingWithoutId,
    });
  }
  return {
    opId,
    opRecordingId,
  };

  // let opFile = await getOpFileFromOpName({
  //   schemaId: opPlan.schemaId,
  //   opName: opPlan.name!,
  // });

  // if (opFile === null) {
  //   opFile = createNewOpFile({
  //     schemaId: opPlan.schemaId,
  //     opName: opPlan.name!,
  //   });
  // }
  // opFile.recordings[opRecording.id] = opRecording;
  // // TODO save opFile
  // return {
  //   opFile,
  //   opRecording,
  // };
};
