import gql from 'graphql-tag';
import { OperationDefinitionNode, FieldNode} from 'graphql';
import editJsonFile from 'edit-json-file';

import { getConfig } from './getConfig';

export const recordQuery = (req, res) => {
  const query = gql`
    ${req.body.query}
  `;

  const file = editJsonFile(`${getConfig().recordingsSaveDirectory}/${getConfig().recordingsFilename}.json`);

  const recording = {
    type: (query.definitions[0] as OperationDefinitionNode).operation,
    name: ((query.definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode).name.value,
  };

  file.set(req.params.id, recording);

  file.save();

  res.sendStatus(200);
};

export const updateRecording = (req, res) => {
  const file = editJsonFile(`${getConfig().recordingsSaveDirectory}/${getConfig().recordingsFilename}.json`);

  const existingRecording = file.get(req.params.id);
  const updatedRecording = {
    ...existingRecording,
    response: req.body,
  };

  file.set(req.params.id, updatedRecording);

  file.save();
  res.sendStatus(200);
};