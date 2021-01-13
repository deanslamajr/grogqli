import { MutationResolvers } from '@grogqli/schema';
import { resolveQueryFromRecording } from '../../../../resolveQueryFromRecording';

export const playbackRecordingResolver: MutationResolvers['playbackRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { query, schemaId, variables: _variables, workflowId },
  } = args;

  const variables: any = _variables !== null ? JSON.parse(_variables) : {};

  const { data, errors } = await resolveQueryFromRecording({
    query,
    schemaId,
    variables,
    workflowId,
  });

  console.log({ data, errors });

  const stringifiedData = JSON.stringify(data);
  const stringifiedErrors = JSON.stringify(errors);

  return {
    data: stringifiedData,
    errors: stringifiedErrors,
  };
};
