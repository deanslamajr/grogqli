import editJsonFile from 'edit-json-file';
import fs from 'fs';

import { getConfig } from '../../../getConfig';

export const getRecordingFile = async (): Promise<editJsonFile.JsonEditor> => {
  const config = await getConfig();
  const recordingsSaveDirectory = config('recordingsSaveDirectory');
  if (!fs.existsSync(recordingsSaveDirectory)) {
    fs.mkdirSync(recordingsSaveDirectory);
  }

  return editJsonFile(
    `${recordingsSaveDirectory}/${config('recordingsFilename')}.json`
  );
};
