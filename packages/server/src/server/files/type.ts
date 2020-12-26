import editJsonFile from 'edit-json-file';
import shortid from 'shortid';

import { TypeRecordingPlan } from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import {
  getTypeFilePath,
  getTypeNameMappingFilePath,
  TYPES_FILE_VERSION,
  TYPES_NAME_TO_ID_MAPPING_VERSION,
} from './';

// pattern to support versioning this file structure
export type TypeRecordingsFile = TypeRecordingsFileVersion1;
interface TypeRecordingsFileVersion1 {
  id: string;
  version: 1;
  recordings: { [recordingId: string]: TypeRecording };
}

interface TypeRecording {
  id: string;
  value: TypeRecordingValue;
}

export type TypeRecordingValue = { [fieldName: string]: any };

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
  if (typeFile.read() === {}) {
    throw new Error(`File for typeId:${typeId} does not exist!`);
  }

  typeFile.set(`recordings.${typeRecordingPlan.typeRecordingId}`, {
    id: typeRecordingPlan.typeRecordingId,
    value: typeRecordingPlan.value,
  });
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
  if (typeFile.read() !== {}) {
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

  typeFile.set('', typeFileContents);
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

  let newTypeId;
  // handle the case where mappings file does not exist
  if (typesMappingFile.read() === {}) {
    const initializedTypeMappingFileData = {
      version: TYPES_NAME_TO_ID_MAPPING_VERSION,
      types: {},
    };
    typesMappingFile.set('', initializedTypeMappingFileData);
    newTypeId = shortid.generate();
  } else {
    let newIdIsNotUnique = true;

    // generate a new typeId that is unique against the existing set of typeId's
    do {
      newTypeId = shortid.generate();
      const typeMappings = Object.values<
        TypeNameToIdMappingVersion1['types'][keyof TypeNameToIdMappingVersion1['types']]
      >(typesMappingFile.get('types'));
      // eslint-disable-next-line no-loop-func
      newIdIsNotUnique = typeMappings.some(({ id }) => id === newTypeId);
    } while (newIdIsNotUnique);
  }

  typesMappingFile.set(`types.${typeName}`, {
    name: typeName,
    id: newTypeId,
  });
  typesMappingFile.save();

  return newTypeId;
};

// allows versioning of this file structure
export type TypeNameToIdMapping = TypeNameToIdMappingVersion1;

interface TypeNameToIdMappingVersion1 {
  version: 1;
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
  const pathToTypeNameToIdMappingFile = await getTypeNameMappingFilePath(
    schemaId
  );
  let typeNameToIdMappingFile: TypeNameToIdMapping;
  try {
    // TODO after a feature is added that updates these `${schemaId}.json` files at runtime,
    // reevaluate whether or not this is necessary:
    // return JSON.parse(
    //   // not using require(`${schemaId}.json`) here (unlike in the resolvers)
    //   // bc we want to bypass the auto caching feature of require
    //   fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
    // );
    typeNameToIdMappingFile = require(pathToTypeNameToIdMappingFile);
  } catch (error) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where a type name to id mappings file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }
  return typeNameToIdMappingFile;
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
  const type = typeNameToIdMappingData.types[typeName];
  if (type === undefined) {
    return null;
  }
  return type.id;
};

type GetTypeRecording = (params: {
  typeId: string;
  recordingId: string;
}) => Promise<TypeRecording>;

export const getTypeRecording: GetTypeRecording = async ({
  typeId,
  recordingId,
}) => {
  const pathToTypeFile = await getTypeFilePath(typeId);

  let typeRecordings: TypeRecordingsFile;
  try {
    typeRecordings = require(pathToTypeFile);
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
