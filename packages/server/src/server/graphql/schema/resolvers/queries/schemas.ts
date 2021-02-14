import { QueryResolvers } from '@grogqli/schema';
import { all as getSchemas } from '../../../../files/schema';

export const schemasResolver: QueryResolvers['schemas'] = async () => {
  return await getSchemas();
};
