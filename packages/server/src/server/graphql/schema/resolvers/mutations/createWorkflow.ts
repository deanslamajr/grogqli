import { MutationResolvers, CreateWorkflowResultCode } from '@grogqli/schema';

import { createOperationRecordingAssetsPlan } from '../../../../createOperationRecordingAssetsPlan';
import { OperationRecordingPlan } from '../../../../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import { createWorkflowAssetsFromPlan } from '../../../../createWorkflowAssetsFromPlan';

export const createWorkflowResolver: MutationResolvers['createWorkflow'] = async (
  _parent: {},
  args,
  _context: {},
  _info: {}
) => {
  const {
    input: { workflow, schemasMapping, operations },
  } = args;

  const opRecordingsPlans = await Promise.all<OperationRecordingPlan>(
    operations.map(({ sessionId, tempRecordingId }) =>
      createOperationRecordingAssetsPlan({
        schemasMapping,
        sessionId,
        tempRecordingId,
      })
    )
  );

  await createWorkflowAssetsFromPlan({
    name: workflow.name,
    description: workflow.description,
    opRecordingsPlans,
  });

  // TODO provide a mechanism for functions (or nested functions) in this resolver
  // to communicate rich information back to the client
  // (e.g. need to do something before continuing with recording).
  // An idea about how to do this would be that functions can throw Errors of unique types
  // that can be parsed at this level and then an error code and context data
  // can be returned from this resolver.
  return {
    resultCode: CreateWorkflowResultCode.Success,
  };
};
