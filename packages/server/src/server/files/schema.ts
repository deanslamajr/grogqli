import shortid from 'shortid';
import editJsonFile from 'edit-json-file';
import { IntrospectionQuery } from 'graphql';

import {
  doesFileExist,
  getTemporarySchemaRecordingFilename,
  mapObjectToJsonFile,
  TEMP_SCHEMA_FILE_VERSION,
} from './';

type TemporarySchemaRecording = TemporarySchemaRecordingVersion1;
interface TemporarySchemaRecordingVersion1 {
  version: 1;
  hash: string;
  introspectionQuery: IntrospectionQuery;
}

type PersistTempSchemaRecording = (
  schemaIntrospectionResult: IntrospectionQuery
) => Promise<string>;

export const persistTempSchemaRecording: PersistTempSchemaRecording = async (
  schemaIntrospectionResult
) => {
  // TODO generate schema hash
  const schemaHash = shortid.generate();

  const newTempSchemaRecording: TemporarySchemaRecording = {
    version: TEMP_SCHEMA_FILE_VERSION,
    hash: schemaHash,
    introspectionQuery: schemaIntrospectionResult,
  };

  const schemaRecordingsPath = await getTemporarySchemaRecordingFilename(
    schemaHash
  );

  const newTempSchemaRecordingFile = editJsonFile(schemaRecordingsPath);

  if (!doesFileExist(newTempSchemaRecordingFile)) {
    mapObjectToJsonFile(newTempSchemaRecording, newTempSchemaRecordingFile);
    newTempSchemaRecordingFile.save();
  } else {
    console.log(`Schema with hash:${schemaHash} has already been recorded!`);
  }

  return schemaHash;
};
