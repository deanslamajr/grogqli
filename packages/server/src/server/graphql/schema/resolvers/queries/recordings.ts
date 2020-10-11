import { QueryResolvers, Recording } from '@grogqli/schema';
import { getRecordingFile } from '../files';

export const resolver: QueryResolvers['recordings'] = async (
  _parent,
  _args,
  context,
  _info
) => {
  const file = await getRecordingFile();
  const recordingsFromFile = file.get();
  const recordings =
    recordingsFromFile && Object.values(recordingsFromFile).length
      ? (Object.values(recordingsFromFile) as Recording[])
      : null;
  return recordings;
};
