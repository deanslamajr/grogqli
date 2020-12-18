import {
  getTypeRecording,
  getTypeIdFromTypeName,
  TypeNameToIdMapping,
} from '../../files';

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
  const typeRecording = await getTypeRecording({
    typeId,
    recordingId,
  });
  return typeRecording.value;
};
