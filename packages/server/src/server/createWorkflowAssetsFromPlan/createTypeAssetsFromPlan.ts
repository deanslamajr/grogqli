import {
  OperationRecordingPlan,
  TypeRecordingPlan,
} from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';
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

  await Promise.all(
    typeRecordingsPlans.map((typeRecordingPlan) =>
      createTypeAsset({ schemaId: operationPlan.schemaId, typeRecordingPlan })
    )
  );
};
