import editJsonFile from 'edit-json-file';
import shortid from 'shortid';
import fs from 'fs';

import { TypeRecordingPlan } from '../../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import {
  doesFileExist,
  getTypeFilePath,
  getTypeNameMappingFilePath,
  mapObjectToJsonFile,
  TYPES_FILE_VERSION,
  TYPES_NAME_TO_ID_MAPPING_VERSION,
} from '..';

import { resolveValueFromTypeRecording } from './resolveValueFromTypeRecording';
import {
  TypeRecordingInstance,
  TypeRecordingInstances,
  TypeRecordingsFile,
} from './types';

type AddNewRecordingToTypeFile = (params: {
  typeId: string;
  typeRecordingPlan: TypeRecordingPlan;
}) => Promise<void>;

export const addNewRecordingToTypeFile: AddNewRecordingToTypeFile = async ({
  typeId,
  typeRecordingPlan,
}) => {
  const pathToTypeFile = await getTypeFilePath(typeId);
  const typeFile = editJsonFile(pathToTypeFile);

  // if this type's file has NOT already been initialized, throw error
  // this is to prevent unexpected behavior
  if (!doesFileExist(typeFile)) {
    throw new Error(`File for typeId:${typeId} does not exist!`);
  }

  const recordings = typeFile.get('recordings') as TypeRecordingInstances;

  recordings[typeRecordingPlan.typeRecordingId] = {
    id: typeRecordingPlan.typeRecordingId,
    value: typeRecordingPlan.value,
  };

  typeFile.set('recordings', recordings);

  typeFile.save();
};

type CreateNewTypeRecordingsFile = (params: {
  schemaId: string;
  typeRecordingPlan: TypeRecordingPlan;
}) => Promise<void>;

export const createNewTypeRecordingsFile: CreateNewTypeRecordingsFile = async ({
  schemaId,
  typeRecordingPlan,
}) => {
  const typeId = await addNewTypeToTypesMappingFile({
    schemaId,
    typeName: typeRecordingPlan.typeName,
  });

  const pathToTypeFile = await getTypeFilePath(typeId);
  const typeFile = editJsonFile(pathToTypeFile);

  // if this file has already been initialized, throw error
  // this is to prevent unexpected behavior
  if (doesFileExist(typeFile)) {
    throw new Error(`File for typeId:${typeId} already exists!`);
  }

  const typeFileContents: TypeRecordingsFile = {
    id: typeId,
    version: TYPES_FILE_VERSION,
    recordings: {
      [typeRecordingPlan.typeRecordingId]: {
        id: typeRecordingPlan.typeRecordingId,
        value: typeRecordingPlan.value,
      },
    },
  };

  mapObjectToJsonFile(typeFileContents, typeFile);
  typeFile.save();
};

type AddNewTypeToTypesMappingFile = (params: {
  schemaId: string;
  typeName: string;
}) => Promise<string>;

export const addNewTypeToTypesMappingFile: AddNewTypeToTypesMappingFile = async ({
  schemaId,
  typeName,
}) => {
  const pathToTypeNameToIdMappingFile = await getTypeNameMappingFilePath(
    schemaId
  );

  const typesMappingFile = await editJsonFile(pathToTypeNameToIdMappingFile);

  const newTypeId = shortid.generate();
  // handle the case where mappings file does not exist
  if (!doesFileExist(typesMappingFile)) {
    const types: Types = {
      [typeName]: {
        name: typeName,
        id: newTypeId,
      },
    };
    const initializedTypeMappingFileData: TypeNameToIdMappingVersion1 = {
      version: TYPES_NAME_TO_ID_MAPPING_VERSION,
      types,
    };
    mapObjectToJsonFile(initializedTypeMappingFileData, typesMappingFile);
  } else {
    const types = typesMappingFile.get('types') as Types;

    types[typeName] = {
      name: typeName,
      id: newTypeId,
    };
    typesMappingFile.set('types', types);
  }

  typesMappingFile.save();

  return newTypeId;
};

interface Types {
  [typeName: string]: {
    name: string;
    id: string;
  };
}
// allows versioning of this file structure
export type TypeNameToIdMapping = TypeNameToIdMappingVersion1;
export interface TypeNameToIdMappingVersion1 {
  version: 1;
  types: Types;
}

export const openTypeNameToIdMapping = async (
  schemaId: string
): Promise<TypeNameToIdMapping | null> => {
  const pathToTypeNameToIdMappingFile = await getTypeNameMappingFilePath(
    schemaId
  );

  const fileExists = fs.existsSync(pathToTypeNameToIdMappingFile);
  if (fileExists === false) {
    return null;
  }

  return JSON.parse(
    await fs.promises.readFile(pathToTypeNameToIdMappingFile, 'utf8')
  );
};

type GetTypeIdFromTypeName = (params: {
  typeName: string;
  typeNameToIdMappingData: TypeNameToIdMapping;
}) => Promise<string | null>;

export const getTypeIdFromTypeName: GetTypeIdFromTypeName = async ({
  typeName,
  typeNameToIdMappingData,
}) => {
  const type = typeNameToIdMappingData.types[typeName];
  if (type === undefined) {
    return null;
  }
  return type.id;
};

type GetTypeIdFromTypeNameAndSchemaId = (params: {
  typeName: string;
  schemaId: string;
}) => Promise<string | null>;

export const getTypeIdFromTypeNameAndSchemaId: GetTypeIdFromTypeNameAndSchemaId = async ({
  typeName,
  schemaId,
}) => {
  const typeNameToIdMappingData = await openTypeNameToIdMapping(schemaId);
  if (typeNameToIdMappingData === null) {
    return null;
  }
  const type = typeNameToIdMappingData.types[typeName];
  if (type === undefined) {
    return null;
  }
  return type.id;
};

type GetTypeRecording = (params: {
  args: { [argName: string]: any };
  typeId: string;
  recordingId: string;
}) => Promise<TypeRecordingInstance>;

export const getTypeRecording: GetTypeRecording = async ({
  args,
  typeId,
  recordingId,
}) => {
  const pathToTypeFile = await getTypeFilePath(typeId);

  let typeRecordings: TypeRecordingsFile;
  try {
    typeRecordings = JSON.parse(
      await fs.promises.readFile(pathToTypeFile, 'utf8')
    );
  } catch (error) {
    console.error(error);
    // TODO handle case where file does not exist for given typeId
    throw new Error(
      `TODO Handle case where type file does not exist. typeId:${typeId}`
    );
  }

  const typeRecording: TypeRecordingInstance | undefined =
    typeRecordings.recordings[recordingId];

  if (typeRecording === undefined) {
    // TODO handle case where type file does not have a recording for the given recordingId
    throw new Error(
      `TODO Handle case where type file does not have a recording for the given id. typeId:${typeId} recordingId:${recordingId}`
    );
  }

  // return typeRecording;

  const typeRecordingValue = resolveValueFromTypeRecording({
    args,
    typeRecording: typeRecording,
    variablesRecordings: typeRecordings.variables,
  });

  return typeRecordingValue;
};
