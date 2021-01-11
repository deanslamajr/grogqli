import { QueryResolvers } from '@grogqli/schema';

import { resolver as recordingsResolver } from './recordings';
import { resolver as workflowsResolver } from './workflows';

export const queryResolver: QueryResolvers = {
  recordings: recordingsResolver,
  workflows: workflowsResolver,
};
