import {MutationResolvers} from '@grogqli/schema';
import gql from 'graphql-tag';
import { OperationDefinitionNode, FieldNode} from 'graphql';
import editJsonFile from 'edit-json-file';
import fs from 'fs';
import shortid from 'shortid';

import { getConfig } from '../../../../getConfig';

const getRecordingFile = async (): Promise<editJsonFile.JsonEditor> => {
  const config = await getConfig();
  const recordingsSaveDirectory = config('recordingsSaveDirectory');
  if (!fs.existsSync(recordingsSaveDirectory)){
    fs.mkdirSync(recordingsSaveDirectory);
  }

  return editJsonFile(`${recordingsSaveDirectory}/${config('recordingsFilename')}.json`);
}

export const createRecordingResolver: MutationResolvers['createRecording'] = async (_parent, args, context, _info) => {
  console.log('inside resolver! args', args)
  const {input: {
    operationName, query: _query, variables: _variables
  }} = args;
  const variables = JSON.parse(_variables);
  const query = gql`${_query}`;
  
  const recording = {
    type: (query.definitions[0] as OperationDefinitionNode).operation,
    name: ((query.definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode).name.value,
    variables
  };

  const recordingId: string = shortid.generate();

  const file = await getRecordingFile();
  file.set(recordingId, recording);
  file.save();

  return {
    newRecording: {
      id: recordingId,
      operationName,
      query: _query,
      variables: _variables
    }
  }
};
