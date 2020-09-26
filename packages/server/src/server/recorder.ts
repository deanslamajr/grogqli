import gql from 'graphql-tag';
import fs from 'fs';
import { OperationDefinitionNode, FieldNode} from 'graphql';
import editJsonFile from 'edit-json-file';

import { getConfig } from './getConfig';

const getRecordingFile = async (): Promise<editJsonFile.JsonEditor> => {
  const config = await getConfig();
  const recordingsSaveDirectory = config('recordingsSaveDirectory');
  if (!fs.existsSync(recordingsSaveDirectory)){
    fs.mkdirSync(recordingsSaveDirectory);
  }

  return editJsonFile(`${recordingsSaveDirectory}/${config('recordingsFilename')}.json`);
}

export const recordQuery = async (req, res) => {
  const query = gql`
    ${req.body.query}
  `;

  const recording = {
    type: (query.definitions[0] as OperationDefinitionNode).operation,
    name: ((query.definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode).name.value,
  };

  const file = await getRecordingFile();
  file.set(req.params.id, recording);

  file.save();

  res.sendStatus(200);
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