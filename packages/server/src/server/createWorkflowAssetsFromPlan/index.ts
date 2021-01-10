import { OperationRecordingPlan } from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import { WorkflowFileBeforeCreation } from '../files/workflow';

import { createOrUpdateOpFile } from './createOrUpdateOperationFile';
import { createNewWorkflowAssets } from './createNewWorkflowAssets';
import { createTypeAssetsFromPlan } from './createTypeAssetsFromPlan';

export interface WorkflowRecordingPlan {
  name: string;
  description: string;
  opRecordingsPlans: OperationRecordingPlan[];
}

export const createWorkflowAssetsFromPlan = async (
  plan: WorkflowRecordingPlan
) => {
  const newWorkflowFile: WorkflowFileBeforeCreation = {
    version: 1,
    description: plan.description,
    operationRecordings: {},
  };

  // Creating new asset files can cause race conditions when executed in parallel
  // e.g. multiple files can be created for the same type
  // Consequently, do these jobs in sequence
  await plan.opRecordingsPlans.reduce(
    (sequentialAsyncTasks, opPlan) =>
      sequentialAsyncTasks.then(async () => {
        // create type recording assets first so that any types that don't yet have type files
        // can have these initialized. Operation recordings require valid typeId's to associate
        // rootTypeRecordingId's to the appropriate root types
        await createTypeAssetsFromPlan(opPlan);

        // create/update grogqli/operations/<opId>.json
        const { opId, opRecordingId } = await createOrUpdateOpFile(opPlan);

        // add an entry to grogqli/workflows/<workflowId>.json#operationRecordings
        newWorkflowFile.operationRecordings[opId] = {
          opId,
          opRecordingId,
        };
      }),
    Promise.resolve()
  );

  await createNewWorkflowAssets({
    newWorkflowFileWithoutId: newWorkflowFile,
    workflowName: plan.name,
  });
};
