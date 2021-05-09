import {
  TypeNameToIdMapping,
  getTypeIdFromTypeName,
  getTypeRecording,
} from '../../files/type';

interface FetchNestedTypeRecordingParams {
  recordingId: string;
  typeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
}

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
  // TODO handle the case where the given typeName does not exist in the given schemaId's types.json
  if (typeId === null) {
    throw new Error(`
      TODO handle the case where the given typeName does not exist in the given types.json.
      typeName:${typeName}
    `);
  }

  const typeRecording = await getTypeRecording({
    args: {}, // TODO: replace hardcoded args value (this was done to make compiler pass)
    typeId,
    recordingId,
  });
  return typeRecording; //.value;
};
