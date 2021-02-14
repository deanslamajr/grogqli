import { MutationResolvers } from '@grogqli/schema';
import { IntrospectionQuery } from 'graphql';

import { persistTempSchemaRecording } from '../../../../files/tempSchemaRecording';

export const createTemporarySchemaRecording: MutationResolvers['createSchemaRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { schemaIntrospectionResult },
  } = args;

  const schemaHash = await persistTempSchemaRecording(
    schemaIntrospectionResult as IntrospectionQuery
  );

  return {
    schemaHash,
  };
};
