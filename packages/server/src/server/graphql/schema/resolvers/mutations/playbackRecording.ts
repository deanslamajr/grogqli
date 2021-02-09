import { MutationResolvers } from '@grogqli/schema';
import { getIdFromUrl as getSchemaIdFromSchemaUrl } from '../../../../files/schemaMapping';
import { resolveQueryFromRecording } from '../../../../resolveQueryFromRecording';

export const playbackRecordingResolver: MutationResolvers['playbackRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { query, schemaUrl, variables, workflowId },
  } = args;

  const schemaId = await getSchemaIdFromSchemaUrl(schemaUrl);

  if (schemaId === null) {
    // TODO ask the user for a mapping
    throw new Error(`
      A schemaId mapping was not found for schemaUrl:${schemaUrl}
    `);
  }

  const { data, errors } = await resolveQueryFromRecording({
    query,
    schemaId,
    variables,
    workflowId,
  });

  return {
    data: data || null,
    errors: errors || null,
  };
};
