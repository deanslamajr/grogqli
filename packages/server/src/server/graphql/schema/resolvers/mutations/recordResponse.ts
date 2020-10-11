import { MutationResolvers, Recording } from '@grogqli/schema';

import { getRecordingFile } from '../files';
import { pubSub } from '../pubSub';
import { RECORDING_SAVED } from '../subscriptions/recordingSavedResolver';

export const recordResponseResolver: MutationResolvers['recordResponse'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { response, recordingId },
  } = args;
  const file = await getRecordingFile();
  const recording: Recording = file.get(recordingId);

  if (!recording) {
    throw new Error(`Recording with id:${recordingId} does not exist!`);
  }

  recording.response = response;

  file.set(recordingId, recording);
  file.save();

  pubSub.publish(RECORDING_SAVED, { recordingSaved: recording });

  return {
    newRecording: recording,
  };
};
