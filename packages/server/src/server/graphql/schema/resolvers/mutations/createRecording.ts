import { MutationResolvers, Recording } from '@grogqli/schema';
import shortid from 'shortid';
import fs from 'fs';

import {
  getQueryRecordingsFile,
  getTemporarySchemaRecordingsPath,
} from '../../../../files';
import { pubSub } from '../pubSub';
import { RECORDING_SAVED } from '../subscriptions/recordingSavedResolver';

export const createRecordingResolver: MutationResolvers['createRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: {
      operationName,
      query: _query,
      variables: _variables,
      schema: { url: schemaUrl, content: schemaString },
      referrer,
    },
  } = args;
  const recordingId: string = shortid.generate();

  if (schemaString) {
    const schemaRecordingsPath = await getTemporarySchemaRecordingsPath();
    fs.writeFileSync(`${schemaRecordingsPath}/test.json`, schemaString);
  }

  const newRecording: Recording = {
    id: recordingId,
    operationName,
    query: _query,
    variables: _variables,
    response: null,
    schemaUrl,
    referrer,
  };

  const file = await getQueryRecordingsFile();
  file.set(recordingId, newRecording);
  file.save();

  pubSub.publish(RECORDING_SAVED, { recordingSaved: newRecording });

  return {
    newRecording,
  };
};
