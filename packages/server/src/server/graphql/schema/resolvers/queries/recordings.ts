import { QueryResolvers, Recording } from '@grogqli/schema';
import { getQueryRecordingsFile } from '../../../../files';

export const resolver: QueryResolvers['recordings'] = async (
  _parent,
  _args,
  context,
  _info
) => {
  const file = await getQueryRecordingsFile();
  const recordingsFromFile = file.get();
  const recordings =
    recordingsFromFile && Object.values(recordingsFromFile).length
      ? (Object.values(recordingsFromFile) as Recording[])
      : null;
  return recordings;
};
