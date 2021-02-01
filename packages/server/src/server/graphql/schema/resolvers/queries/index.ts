import { QueryResolvers } from '@grogqli/schema';

import { resolver as handlersResolver } from './handlers';
import { resolver as temporaryOperationRecordingsResolver } from './temporaryOperationRecordings';
import { resolver as workflowsResolver } from './workflows';

export const queryResolver: QueryResolvers = {
  handlers: handlersResolver,
  temporaryOperationRecordings: temporaryOperationRecordingsResolver,
  workflows: workflowsResolver,
};
