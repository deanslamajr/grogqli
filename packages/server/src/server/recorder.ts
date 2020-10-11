import fs from 'fs';
import editJsonFile from 'edit-json-file';
import { getConfig } from './getConfig';

const getRecordingFile = async (): Promise<editJsonFile.JsonEditor> => {
  const config = await getConfig();
  const recordingsSaveDirectory = config('recordingsSaveDirectory');
  if (!fs.existsSync(recordingsSaveDirectory)) {
    fs.mkdirSync(recordingsSaveDirectory);
  }

  return editJsonFile(
    `${recordingsSaveDirectory}/${config('recordingsFilename')}.json`
  );
};

export const updateRecording = async (req, res) => {
  const file = await getRecordingFile();
  const existingRecording = file.get(req.params.id);

  const updatedRecording = {
    ...existingRecording,
    response: req.body,
  };

  file.set(req.params.id, updatedRecording);
  file.save();

  res.sendStatus(200);
};
