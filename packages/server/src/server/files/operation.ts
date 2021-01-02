import shortid from 'shortid';
import editJsonFile from 'edit-json-file';

import {
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

// pattern to support versioning this file structure
export type OperationRecordingsFile = OperationRecordingsFileVersion1;
export interface OperationRecordingsFileVersion1 {
  id: string;
  version: 1;
  recordings: {
    [opRecordingId: string]: OperationRecording;
  };
}

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
  if (opRecordingsFile.read() !== {}) {
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

  opRecordingsFile.set('', operationRecordingsFileContents);
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
  if (opsMappingFile.read() === {}) {
    const initializedOpMappingFileData: OperationNameToIdMappingVersion1 = {
      version: OPERATIONS_NAME_TO_ID_MAPPING_VERSION,
      operations: {},
    };
    opsMappingFile.set('', initializedOpMappingFileData);
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

type GetOpFileFromOpName = (params: {
  opName: string;
  schemaId: string;
}) => Promise<OperationRecordingsFileVersion1 | null>;

export const getOpFileFromOpName: GetOpFileFromOpName = async ({
  opName,
  schemaId,
}) => {
  const opsMappingFile = await loadOperationsMappingFile(schemaId);
  const opEntry = opsMappingFile.operations[opName];

  if (opEntry === undefined) {
    return null;
  }

  const operationFile = await getOperationFile(opEntry.id);

  if (operationFile === undefined) {
    return null;
  }

  return operationFile;
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
    operationFile = require(pathToOperationFile);
  } catch (error) {
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
): Promise<OperationNameToIdMappingVersion1> => {
  // TODO after a feature is added that updates these `${schemaId}.json` files at runtime,
  // reevaluate whether or not this is necessary:
  // return JSON.parse(
  //   // not using require(`${schemaId}.json`) here (unlike in the resolvers)
  //   // bc we want to bypass the auto caching feature of require
  //   fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  // );
  const pathToOperationsData = await getOpNameMappingFilePath(schemaId);
  let operationsData: OperationNameToIdMappingVersion1;
  try {
    operationsData = require(pathToOperationsData);
  } catch (error) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where a operations file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }
  return operationsData;
};
