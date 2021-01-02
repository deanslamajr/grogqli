import { getTypeIdFromTypeNameAndSchemaId } from '../../files/type';
import { OperationRecordingWithoutId } from '../../files/operation';
import { OperationRecordingPlan } from '../../createOperationRecordingAssetsPlan/createRecorderApolloServer';

type CreateOpRecording = (params: {
  opPlan: OperationRecordingPlan;
}) => Promise<OperationRecordingWithoutId>;

export const createOpRecording: CreateOpRecording = async ({ opPlan }) => {
  const opRecording: OperationRecordingWithoutId = {
    rootTypeRecordings: {},
  };

  await Promise.all(
    Array.from(opPlan.rootTypeRecordingIds).map(async (rootTypeRecordingId) => {
      const rootTypeRecording = opPlan.typeRecordings[rootTypeRecordingId];
      if (rootTypeRecording === undefined) {
        // TODO handle case where the given rootTypeRecordingId does not have an associated typeRecording entry in the recording plan.
        throw new Error(`
          TODO handle case where the given rootTypeRecordingId does not have an associated typeRecording entry in the recording plan.
          rootTypeRecordingId:${rootTypeRecordingId}
        `);
      }

      const typeName = rootTypeRecording.typeName;
      const rootTypeId = await getTypeIdFromTypeNameAndSchemaId({
        schemaId: opPlan.schemaId,
        typeName,
      });
      if (rootTypeId === null) {
        // TODO handle the case where the given typeName does not exist in the given schemaId's types.json
        throw new Error(`
          TODO handle the case where the given typeName does not exist in the given types.json.
          typeName:${typeName}
        `);
      }

      // add a key with the typeId of the type associated with the given typeRecordingId
      opRecording.rootTypeRecordings[rootTypeId] = {
        rootTypeId,
        recordingId: rootTypeRecordingId,
      };
    })
  );

  return opRecording;
};
