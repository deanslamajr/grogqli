import shortid from 'shortid';
import editJsonFile from 'edit-json-file';
import fs from 'fs';

import {
  doesFileExist,
  mapObjectToJsonFile,
  OPERATIONS_NAME_TO_ID_MAPPING_VERSION,
  OPERATIONS_RECORDING_VERSION,
  getOpNameMappingFilePath,
  getOperationRecordingsFilePath,
} from './';

export interface RootTypeRecordingEntry {
  rootTypeId: string;
  recordingId: string;
}

export interface OperationRecording {
  id: string;
  rootTypeRecordings: {
    [rootTypeId: string]: RootTypeRecordingEntry;
  };
}

export type OperationRecordingWithoutId = Omit<OperationRecording, 'id'>;

interface OperationRecordings {
  [opRecordingId: string]: OperationRecording;
}

// pattern to support versioning this file structure
export type OperationRecordingsFile = OperationRecordingsFileVersion1;
export interface OperationRecordingsFileVersion1 {
  id: string;
  version: 1;
  recordings: OperationRecordings;
}

type AddNewRecordingToOperationRecordingsFile = (params: {
  opId: string;
  opRecordingWithoutId: OperationRecordingWithoutId;
}) => Promise<string>;

export const addNewRecordingToOperationRecordingsFile: AddNewRecordingToOperationRecordingsFile = async ({
  opId,
  opRecordingWithoutId,
}) => {
  const pathToOperationRecordingsFile = await getOperationRecordingsFilePath(
    opId
  );
  const opRecordingsFile = editJsonFile(pathToOperationRecordingsFile);

  // if this file has not yet been initialized, throw error
  // this is to prevent unexpected behavior
  if (!doesFileExist(opRecordingsFile)) {
    throw new Error(
      `An operation recordings file associated with opId:${opId} does not yet exist!`
    );
  }

  let newIdIsNotUnique = true;
  let newOpRecordingId: string;

  const opRecordings: OperationRecordings = opRecordingsFile.get('recordings');

  const opRecordingsAsArray = Object.values<
    OperationRecordingsFileVersion1['recordings'][keyof OperationRecordingsFileVersion1['recordings']]
  >(opRecordings);

  // generate a new recordingId that is unique against the existing set of recordingId's
  do {
    newOpRecordingId = shortid.generate();
    newIdIsNotUnique = opRecordingsAsArray.some(
      // eslint-disable-next-line no-loop-func
      ({ id }) => id === newOpRecordingId
    );
  } while (newIdIsNotUnique);

  const operationRecording: OperationRecording = {
    ...opRecordingWithoutId,
    id: newOpRecordingId,
  };

  const opRecordingsWithNewRecording: OperationRecordings = {
    ...opRecordings,
    [newOpRecordingId]: operationRecording,
  };

  opRecordingsFile.set('recordings', opRecordingsWithNewRecording);
  opRecordingsFile.save();

  return newOpRecordingId;
};

type CreateNewOpFile = (args: {
  opName: string;
  opRecordingWithoutId: OperationRecordingWithoutId;
  schemaId: string;
}) => Promise<{
  opId: string;
  opRecordingId: string;
}>;

export const createNewOperationRecordingsFile: CreateNewOpFile = async ({
  opName,
  opRecordingWithoutId,
  schemaId,
}) => {
  const opId = await addNewOperationToOpMappingFile({
    schemaId,
    opName,
  });

  const pathToOperationRecordingsFile = await getOperationRecordingsFilePath(
    opId
  );
  const opRecordingsFile = editJsonFile(pathToOperationRecordingsFile);

  // if this file has already been initialized, throw error
  // this is to prevent unexpected behavior
  if (doesFileExist(opRecordingsFile)) {
    throw new Error(`File for opId:${opId} already exists!`);
  }

  const opRecordingId = shortid.generate();

  const operationRecording: OperationRecording = {
    ...opRecordingWithoutId,
    id: opRecordingId,
  };

  const operationRecordingsFileContents: OperationRecordingsFileVersion1 = {
    id: opId,
    version: OPERATIONS_RECORDING_VERSION,
    recordings: {
      [opRecordingId]: operationRecording,
    },
  };

  mapObjectToJsonFile(operationRecordingsFileContents, opRecordingsFile);
  opRecordingsFile.save();

  return {
    opId,
    opRecordingId,
  };
};

type AddNewOperationToOpMappingFile = (params: {
  schemaId: string;
  opName: string;
}) => Promise<string>;

export const addNewOperationToOpMappingFile: AddNewOperationToOpMappingFile = async ({
  schemaId,
  opName,
}) => {
  const pathToOpNameToIdMappingFile = await getOpNameMappingFilePath(schemaId);
  const opsMappingFile = await editJsonFile(pathToOpNameToIdMappingFile);

  let newOpId;
  // handle the case where mappings file does not exist
  if (!doesFileExist(opsMappingFile)) {
    const initializedOpMappingFileData: OperationNameToIdMappingVersion1 = {
      version: OPERATIONS_NAME_TO_ID_MAPPING_VERSION,
      operations: {},
    };
    mapObjectToJsonFile(initializedOpMappingFileData, opsMappingFile);
    newOpId = shortid.generate();
  } else {
    let newIdIsNotUnique = true;

    // generate a new typeId that is unique against the existing set of typeId's
    do {
      newOpId = shortid.generate();
      const opMappings = Object.values<
        OperationNameToIdMappingVersion1['operations'][keyof OperationNameToIdMappingVersion1['operations']]
      >(opsMappingFile.get('operations'));
      // eslint-disable-next-line no-loop-func
      newIdIsNotUnique = opMappings.some(({ id }) => id === newOpId);
    } while (newIdIsNotUnique);
  }

  opsMappingFile.set(`operations.${opName}`, {
    name: opName,
    id: newOpId,
  });
  opsMappingFile.save();

  return newOpId;
};

type GetOperationIdFromName = (params: {
  opName: string;
  schemaId: string;
}) => Promise<string | null>;

export const getOperationIdFromName: GetOperationIdFromName = async ({
  opName,
  schemaId,
}) => {
  const opsMappingFile = await loadOperationsMappingFile(schemaId);
  if (opsMappingFile === null) {
    return null;
  }

  const opEntry = opsMappingFile.operations[opName];
  if (opEntry === undefined) {
    return null;
  }

  return opEntry.id;
};

export const getOperationFile = async (
  operationId: string
): Promise<OperationRecordingsFileVersion1 | null> => {
  if (!operationId) {
    return null;
  }
  let operationFile: OperationRecordingsFileVersion1;
  const pathToOperationFile = await getOperationRecordingsFilePath(operationId);

  try {
    operationFile = JSON.parse(
      await fs.promises.readFile(pathToOperationFile, 'utf8')
    );
  } catch (error) {
    console.error(error);
    return null;
  }

  return operationFile;
};

// allows versioning of this file structure
export type OperationNameToIdMapping = OperationNameToIdMappingVersion1;

export interface OperationNameToIdMappingVersion1 {
  version: number;
  operations: {
    [opName: string]: {
      name: string;
      id: string;
    };
  };
}

export const loadOperationsMappingFile = async (
  schemaId: string
): Promise<OperationNameToIdMappingVersion1 | null> => {
  const pathToOperationsData = await getOpNameMappingFilePath(schemaId);
  let operationsData: OperationNameToIdMappingVersion1;

  try {
    operationsData = JSON.parse(
      await fs.promises.readFile(pathToOperationsData, 'utf8')
    );
  } catch (error) {
    console.error(error);
    return null;
  }

  return operationsData;
};
