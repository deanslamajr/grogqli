import { QueryResolvers, TemporaryOperationRecording } from '@grogqli/schema';
import {
  getAll as getTempOpRecordings,
  TemporaryOperationRecordingFile,
} from '../../../../files/tempOpRecording';

const transform = (
  file: TemporaryOperationRecordingFile
): TemporaryOperationRecording => {
  return {
    id: file.id,
    operationName: file.operationName,
    query: file.query,
    variables: file.variables,
    response: file.response,
    tempSchemaRecordingId: file.tempSchemaRecordingId,
    referrer: file.referrer,
  };
};

export const resolver: QueryResolvers['temporaryOperationRecordings'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const files = await getTempOpRecordings(args.input.sessionId);
  return files.map((file) => transform(file));
};
