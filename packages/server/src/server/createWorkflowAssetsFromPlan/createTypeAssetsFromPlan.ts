import {
  OperationRecordingPlan,
  TypeRecordingPlan,
} from '../graphql/schema/resolvers/mutations/createWorkflow';
import {
  addNewRecordingToTypeFile,
  createNewTypeRecordingsFile,
  getTypeIdFromTypeNameAndSchemaId,
} from '../files/type';

type CreateTypeAsset = (params: {
  schemaId: string;
  typeRecordingPlan: TypeRecordingPlan;
}) => Promise<void>;

const createTypeAsset: CreateTypeAsset = async ({
  schemaId,
  typeRecordingPlan,
}) => {
  const typeId = await getTypeIdFromTypeNameAndSchemaId({
    typeName: typeRecordingPlan.typeName,
    schemaId,
  });

  // if entry doesn't exist, need to create the file and mapping also
  if (typeId === null) {
    await createNewTypeRecordingsFile({
      schemaId,
      typeRecordingPlan,
    });
  } else {
    await addNewRecordingToTypeFile({
      typeId,
      typeRecordingPlan,
    });
  }
};

type CreateTypeAssetsFromPlan = (
  operationPlan: OperationRecordingPlan
) => Promise<void>;

export const createTypeAssetsFromPlan: CreateTypeAssetsFromPlan = async (
  operationPlan
) => {
  const typeRecordingsPlans = Object.values(operationPlan.typeRecordings);

  // Creating new type assets can cause race conditions
  // where multiple files can be created in parallel for the same type
  // consequently, do these jobs in sequence
  return typeRecordingsPlans.reduce(
    (asyncTasks, typeRecordingPlan) =>
      asyncTasks.then(() =>
        createTypeAsset({ schemaId: operationPlan.schemaId, typeRecordingPlan })
      ),
    Promise.resolve()
  );
};
