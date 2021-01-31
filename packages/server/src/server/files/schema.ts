import shortid from 'shortid';
import editJsonFile from 'edit-json-file';

import {
  doesFileExist,
  getTemporarySchemaRecordingFilename,
  mapObjectToJsonFile,
  TEMP_SCHEMA_FILE_VERSION,
} from './';

type TemporarySchemaRecording = TemporarySchemaRecordingVersion1;
interface TemporarySchemaRecordingVersion1 {
  version: 1;
  id: string;
  url: string;
  schema: string;
}

type PersistTempSchemaRecording = (params: {
  schema: string;
  sessionId: string;
  url: string;
}) => Promise<string>;

export const persistTempSchemaRecording: PersistTempSchemaRecording = async ({
  schema,
  sessionId,
  url,
}) => {
  const newTempSchemaRecording: TemporarySchemaRecording = {
    version: TEMP_SCHEMA_FILE_VERSION,
    id: shortid.generate(),
    url,
    schema,
  };

  const schemaRecordingsPath = await getTemporarySchemaRecordingFilename({
    sessionId,
    schemaId: newTempSchemaRecording.id,
  });

  const newTempSchemaRecordingFile = editJsonFile(schemaRecordingsPath);

  if (doesFileExist(newTempSchemaRecordingFile)) {
    // file should not already exist
    // if it does, this probably means that the generated id is
    // already in use as an id for another session
    throw new Error(
      `The generated temporary schema recording id:${newTempSchemaRecording.id} seems to already be in use!`
    );
  } else {
    mapObjectToJsonFile(newTempSchemaRecording, newTempSchemaRecordingFile);
  }

  newTempSchemaRecordingFile.save();

  return newTempSchemaRecording.id;
};
