import editJsonFile from 'edit-json-file';
import shortid from 'shortid';

import {
  doesFileExist,
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
}) => Promise<TemporaryOperationRecordingFileVersion1>;

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

  return tempOpRecordingFile.read() as TemporaryOperationRecordingFileVersion1;
};

type Create = (params: {
  operationName: string;
  query: string;
  variables: any;
  response: string | null;
  referrer: string;
  sessionId: string;
  tempSchemaRecordingId: string;
}) => Promise<TemporaryOperationRecordingFileVersion1>;

export const create: Create = async ({
  operationName,
  query,
  variables,
  response,
  referrer,
  sessionId,
  tempSchemaRecordingId,
}) => {
  const newTempOpRecordingFileContents: TemporaryOperationRecordingFileVersion1 = {
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
