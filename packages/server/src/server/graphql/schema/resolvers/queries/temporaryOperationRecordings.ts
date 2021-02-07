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
    schemaHash: file.schemaHash,
    schemaUrl: file.schemaUrl,
    sessionId: file.sessionId,
    referrer: file.referrer,
  };
};

export const resolver: QueryResolvers['temporaryOperationRecordings'] = async (
  _parent,
  args
) => {
  const files = await getTempOpRecordings(args.input.sessionId);
  return files.map((file) => transform(file));
};
