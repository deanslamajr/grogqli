import { createOperationRecordingAssetsPlan } from '../../../../createOperationRecordingAssetsPlan';
import { createWorkflowAssetsFromPlan } from '../../../../createWorkflowAssetsFromPlan';

interface Args {
  input: {
    workflow: {
      name: string;
      description: string;
    };
    operations: Array<{
      recordingId: string;
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
    operations.map(({ recordingId }) =>
      createOperationRecordingAssetsPlan({ recordingId })
    )
  );

  await createWorkflowAssetsFromPlan({
    name: workflow.name,
    description: workflow.description,
    opRecordingsPlans,
  });

  return {
    result: {},
  };
};
