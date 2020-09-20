import gql from 'graphql-tag';
import editJsonFile from 'edit-json-file';

import { recordingFilename } from './constants';

export const recordQuery = (locals) => (req, res) => {
  // console.log('locals', locals)
  //

  const query = gql`
    ${req.body.query}
  `;

  const file = editJsonFile(`${locals.saveDirectory}/${recordingFilename}.json`);

  const recording = {
    type: query.definitions[0].operation,
    name: query.definitions[0].selectionSet.selections[0].name.value,
  };

  file.set(req.params.id, recording);

  file.save();

  res.sendStatus(200);
};

export const updateRecording = (locals) => (req, res) => {
  // console.log('locals', locals)

  const file = editJsonFile(`${locals.saveDirectory}/${recordingFilename}.json`);

  const existingRecording = file.get(req.params.id);
  const updatedRecording = {
    ...existingRecording,
    response: req.body,
  };

  file.set(req.params.id, updatedRecording);

  file.save();
  res.sendStatus(200);
};