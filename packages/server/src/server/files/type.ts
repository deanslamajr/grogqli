import path from 'path';

import {
  getRecordingsRootDir,
  getSchemasFolderPath,
  TYPES_FOLDER_NAME,
  TYPES_NAME_TO_ID_MAPPING_FILENAME,
} from './';

export interface TypeNameToIdMapping {
  version: number;
  types: {
    [typeName: string]: {
      name: string;
      id: string;
    };
  };
}

export const openTypeNameToIdMapping = async (
  schemaId: string
): Promise<TypeNameToIdMapping> => {
  const schemasFolderPath = await getSchemasFolderPath();
  // TODO after a feature is added that updates these `${schemaId}.json` files at runtime,
  // reevaluate whether or not this is necessary:
  // return JSON.parse(
  //   // not using require(`${schemaId}.json`) here (unlike in the resolvers)
  //   // bc we want to bypass the auto caching feature of require
  //   fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  // );
  const pathToTypeNameToIdMappingFile = path.join(
    schemasFolderPath,
    schemaId,
    TYPES_NAME_TO_ID_MAPPING_FILENAME
  );
  let typeNameToIdMappingFile: TypeNameToIdMapping;
  try {
    typeNameToIdMappingFile = require(pathToTypeNameToIdMappingFile);
  } catch (error) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where a type name to id mappings file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }
  return typeNameToIdMappingFile;
};

interface GetTypeIdFromTypeNameParams {
  typeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
}

export const getTypeIdFromTypeName = async ({
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

export type TypeRecordingValue = { [fieldName: string]: any };

export interface TypeRecordingsFile {
  id: string;
  version: number;
  recordings: { [recordingId: string]: TypeRecording };
}

interface TypeRecording {
  version: number;
  id: string;
  value: TypeRecordingValue;
}

type GetTypeRecording = (params: {
  typeId: string;
  recordingId: string;
}) => Promise<TypeRecording>;

export const getTypeRecording: GetTypeRecording = async ({
  typeId,
  recordingId,
}) => {
  const recordingsRootDir = await getRecordingsRootDir();
  const pathToTypeRecordings = path.join(
    recordingsRootDir,
    TYPES_FOLDER_NAME,
    `${typeId}.json`
  );

  let typeRecordings: TypeRecordingsFile;
  try {
    typeRecordings = require(pathToTypeRecordings);
  } catch (error) {
    console.error(error);
    // TODO handle case where file does not exist for given typeId
    throw new Error(
      `TODO Handle case where type file does not exist. typeId:${typeId}`
    );
  }

  const typeRecording: TypeRecording | undefined =
    typeRecordings.recordings[recordingId];

  if (typeRecording === undefined) {
    // TODO handle case where type file does not have a recording for the given recordingId
    throw new Error(
      `TODO Handle case where type file does not have a recording for the given id. typeId:${typeId} recordingId:${recordingId}`
    );
  }

  return typeRecording;
};
