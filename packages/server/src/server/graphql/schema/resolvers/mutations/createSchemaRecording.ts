import { MutationResolvers } from '@grogqli/schema';

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

  return {
    schemaHash: 'test hash',
  };
};
