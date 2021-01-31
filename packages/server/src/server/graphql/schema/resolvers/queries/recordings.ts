import { QueryResolvers, TemporaryOperationRecording } from '@grogqli/schema';
import { getTempOpRecordingFileName } from '../../../../files';

export const resolver: QueryResolvers['recordings'] = async (
  _parent,
  _args,
  context,
  _info
) => {
  const file = await getTempOpRecordingFileName();
  const recordingsFromFile = file.get();
  const recordings =
    recordingsFromFile && Object.values(recordingsFromFile).length
      ? (Object.values(recordingsFromFile) as TemporaryOperationRecording[])
      : null;
  return recordings;
};
