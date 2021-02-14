import { QueryResolvers } from '@grogqli/schema';

import { resolver as handlersResolver } from './handlers';
import { schemasResolver } from './schemas';
import { resolver as temporaryOperationRecordingsResolver } from './temporaryOperationRecordings';
import { resolver as workflowsResolver } from './workflows';

export const queryResolver: QueryResolvers = {
  handlers: handlersResolver,
  schemas: schemasResolver,
  temporaryOperationRecordings: temporaryOperationRecordingsResolver,
  workflows: workflowsResolver,
};
