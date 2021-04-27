import { QueryResolvers, SchemaRecording } from '@grogqli/schema';
import { all as getSchemas } from '../../../../files/schema';

export const schemasResolver: QueryResolvers['schemas'] = async () => {
  return ((await getSchemas()) as unknown) as SchemaRecording[];
};
