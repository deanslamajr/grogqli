import { MutationResolvers } from '@grogqli/schema';
import { IntrospectionQuery } from 'graphql';

import { persistTempSchemaRecording } from '../../../../files/schema';

export const createSchemaRecordingResolver: MutationResolvers['createSchemaRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { schemaIntrospectionResult },
  } = args;

  console.log('schemaIntrospectionResult', schemaIntrospectionResult);

  const schemaHash = await persistTempSchemaRecording(
    schemaIntrospectionResult as IntrospectionQuery
  );

  return {
    schemaHash,
  };
};
