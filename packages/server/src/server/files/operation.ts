import path from 'path';
import shortid from 'shortid';

import {
  OPERATIONS_FILENAME,
  OPERATIONS_FOLDER_NAME,
  getRecordingsRootDir,
  getSchemasFolderPath,
} from './';

export interface OperationFile {
  id: string;
  version: number;
  recordings: {
    [opRecordingId: string]: {
      id: string;
      rootTypeRecordings: {
        [rootTypeId: string]: {
          recordingId: string;
        };
      };
    };
  };
}

type CreateNewOpFile = (args: {
  opName: string;
  schemaId: string;
}) => OperationFile;

export const createNewOpFile: CreateNewOpFile = async (args) => {
  // - generate a new unique opId
  const opId = shortid.generate();
  // - add entry to grogqli/schemas/<opPlan.schemaId>/operations.json
  const opMapFile = await loadOperationsMappingFile(args.schemaId);

  // - create grogqli/operations/<opId>.json
  //   - recordings - empty object
};

type GetOpFileFromOpName = (params: {
  opName: string;
  schemaId: string;
}) => Promise<OperationFile | null>;

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
): Promise<OperationFile | null> => {
  if (!operationId) {
    return null;
  }
  let operationFile: OperationFile;
  const recordingsRootDir = await getRecordingsRootDir();
  const pathToOperationFile = path.join(
    recordingsRootDir,
    OPERATIONS_FOLDER_NAME,
    `${operationId}.json`
  );

  try {
    operationFile = require(pathToOperationFile);
  } catch (error) {
    return null;
  }

  return operationFile;
};

export interface OperationsMappingFile {
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
): Promise<OperationsMappingFile> => {
  const schemasFolderPath = await getSchemasFolderPath();
  // TODO after a feature is added that updates these `${schemaId}.json` files at runtime,
  // reevaluate whether or not this is necessary:
  // return JSON.parse(
  //   // not using require(`${schemaId}.json`) here (unlike in the resolvers)
  //   // bc we want to bypass the auto caching feature of require
  //   fs.readFileSync(path.join(schemaRecordingsPath, `${schemaId}.json`), 'utf8')
  // );
  const pathToOperationsData = path.join(
    schemasFolderPath,
    schemaId,
    OPERATIONS_FILENAME
  );
  let operationsData: OperationsMappingFile;
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
