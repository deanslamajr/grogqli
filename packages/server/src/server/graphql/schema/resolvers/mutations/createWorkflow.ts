import { createOperationRecordingAssetsPlan } from '../../../../createOperationRecordingAssetsPlan';
import { createWorkflowAssetsFromPlan } from '../../../../createWorkflowAssetsFromPlan';

interface Args {
  input: {
    workflow: {
      name: string;
      description: string;
    };
    operations: Array<{
      tempRecordingId: string;
    }>;
  };
}

export const createWorkflow = async (
  _parent: {},
  args: Args,
  _context: {},
  _info: {}
) => {
  const {
    input: { workflow, operations },
  } = args;

  const opRecordingsPlans = await Promise.all(
    operations.map(({ tempRecordingId }) =>
      createOperationRecordingAssetsPlan({ tempRecordingId })
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
    result: {},
  };
};
