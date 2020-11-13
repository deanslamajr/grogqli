import { getTypeRecording, TypeNameToIdMapping } from '../../files';

interface FetchNestedTypeRecordingParams {
  recordingId: string;
  typeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
}

interface GetTypeIdFromTypeNameParams {
  typeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
}

const getTypeIdFromTypeName = async ({
  typeName,
  typeNameToIdMappingData,
}: GetTypeIdFromTypeNameParams): Promise<string> => {
  // return the mapping of the given typeName
  const type = typeNameToIdMappingData.types[typeName];
  // TODO handle the case where the given typeName does not exist in the given schemaId's types.json
  if (type === undefined) {
    throw new Error(`
      TODO handle the case where the given typeName does not exist in the given types.json.
      typeName:${typeName}
    `);
  }
  return type.id;
};

// TODO handle args
// TODO optimization: should only need to do this once for all root level fields of the given query execution
//  * wait for semaphore access (only allows a single access at any given time) https://www.npmjs.com/package/await-semaphore
//  * after acquiring semaphore, check cache for resolved value
//  * If exists, release semaphore and return value
//  * Else, do the work below, set cache, release semaphore, and return value
export const fetchNestedTypeRecording = async ({
  recordingId,
  typeName,
  typeNameToIdMappingData,
}: FetchNestedTypeRecordingParams) => {
  const typeId = await getTypeIdFromTypeName({
    typeName,
    typeNameToIdMappingData,
  });
  const typeRecording = await getTypeRecording({
    typeId,
    recordingId,
  });
  return typeRecording.value;
};
