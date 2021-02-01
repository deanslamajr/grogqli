import editJsonFile from 'edit-json-file';
import shortid from 'shortid';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

import {
  doesFileExist,
  getTempOpRecordingsFolderPath,
  getTempOpRecordingFileName,
  mapObjectToJsonFile,
  TEMP_OP_RECORDING_FILE_VERSION,
} from './';

export type TemporaryOperationRecordingFile = TemporaryOperationRecordingFileVersion1;
type TemporaryOperationRecordingFileVersion1 = {
  version: 1;
  id: string;
  operationName: string;
  query: string;
  variables: string;
  response: string | null;
  referrer: string;
  tempSchemaRecordingId: string;
};

type Update = (params: {
  response: string | null;
  sessionId: string;
  tempOpRecordingId: string;
}) => Promise<TemporaryOperationRecordingFile>;

export const update: Update = async ({
  response,
  sessionId,
  tempOpRecordingId,
}) => {
  const tempOpRecordingFileName = await getTempOpRecordingFileName({
    sessionId,
    tempOpRecordingId,
  });

  const tempOpRecordingFile = editJsonFile(tempOpRecordingFileName);

  if (!doesFileExist(tempOpRecordingFile)) {
    // file should already exist
    throw new Error(
      `The given tempOpRecordingId:${tempOpRecordingId} with sessionId:${sessionId} does not seem to exist!`
    );
  }

  tempOpRecordingFile.set('response', response);
  tempOpRecordingFile.save();

  return tempOpRecordingFile.read() as TemporaryOperationRecordingFile;
};

type Create = (params: {
  operationName: string;
  query: string;
  variables: any;
  response: string | null;
  referrer: string;
  sessionId: string;
  tempSchemaRecordingId: string;
}) => Promise<TemporaryOperationRecordingFile>;

export const create: Create = async ({
  operationName,
  query,
  variables,
  response,
  referrer,
  sessionId,
  tempSchemaRecordingId,
}) => {
  const newTempOpRecordingFileContents: TemporaryOperationRecordingFile = {
    version: TEMP_OP_RECORDING_FILE_VERSION,
    id: shortid.generate(),
    operationName,
    query,
    variables,
    response,
    referrer,
    tempSchemaRecordingId,
  };

  const tempOpRecordingFileName = await getTempOpRecordingFileName({
    sessionId,
    tempOpRecordingId: newTempOpRecordingFileContents.id,
  });

  const tempOpRecordingFile = editJsonFile(tempOpRecordingFileName);

  if (doesFileExist(tempOpRecordingFile)) {
    // file should not already exist
    // if it does, this probably means that the generated id is
    // already in use as an id for another temp op recording
    throw new Error(
      `The generated temp op recording id:${newTempOpRecordingFileContents.id} seems to already be in use!`
    );
  } else {
    mapObjectToJsonFile(newTempOpRecordingFileContents, tempOpRecordingFile);
  }

  tempOpRecordingFile.save();

  return newTempOpRecordingFileContents;
};

type GetTempOpRecordingFileFromDisk = (
  filePath: string
) => Promise<TemporaryOperationRecordingFile>;

const getTempOpRecordingFileFromDisk: GetTempOpRecordingFileFromDisk = async (
  filePath
) => {
  let tempOpRecordingFile: TemporaryOperationRecordingFile;
  try {
    tempOpRecordingFile = JSON.parse(
      await fs.promises.readFile(filePath, 'utf8')
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error while attempting to open temporary operation recording file:${filePath}`
    );
  }

  return tempOpRecordingFile;
};

type GetAll = (sessionId: string) => Promise<TemporaryOperationRecordingFile[]>;

export const getAll: GetAll = async (sessionId) => {
  const tempOpRecordingsFolderPath = await getTempOpRecordingsFolderPath(
    sessionId
  );

  const tempOpRecordingsFilenames = await new Promise<string[]>(
    (resolve, reject) => {
      // glob path should always use forward slash, even in windows
      glob(
        `${tempOpRecordingsFolderPath}/*.json`,
        { nonull: false },
        (error, files) => {
          if (error) {
            return reject(error);
          }
          return resolve(files);
        }
      );
    }
  );

  return Promise.all(
    tempOpRecordingsFilenames.map((filename) => {
      const tempOpRecordingPath = path.join(
        tempOpRecordingsFolderPath,
        filename
      );
      return getTempOpRecordingFileFromDisk(tempOpRecordingPath);
    })
  );
};
