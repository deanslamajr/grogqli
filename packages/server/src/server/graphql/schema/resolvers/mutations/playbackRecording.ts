import { MutationResolvers } from '@grogqli/schema';
import { ApolloError } from 'apollo-server-core';
import { getIdFromUrl as getSchemaIdFromSchemaUrl } from '../../../../files/schemaMapping';
import { resolveQueryFromRecording } from '../../../../resolveQueryFromRecording';

const SCHEMAURL_MAPPING_NOT_FOUND = 'SCHEMAURL_MAPPING_NOT_FOUND';

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
    throw new ApolloError(
      `
      A schemaId mapping was not found for schemaUrl:${schemaUrl}
    `,
      SCHEMAURL_MAPPING_NOT_FOUND
    );
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
