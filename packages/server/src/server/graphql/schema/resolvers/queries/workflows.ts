import { QueryResolvers } from '@grogqli/schema';
import { getWorkflows } from '../../../../files/workflow';

export const resolver: QueryResolvers['workflows'] = async () => {
  return getWorkflows();
};
