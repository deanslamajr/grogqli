import { QueryResolvers } from '@grogqli/schema';

import { resolver as handlersResolver } from './handlers';
import { resolver as recordingsResolver } from './recordings';
import { resolver as workflowsResolver } from './workflows';

export const queryResolver: QueryResolvers = {
  handlers: handlersResolver,
  recordings: recordingsResolver,
  workflows: workflowsResolver,
};
