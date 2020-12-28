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

  await Promise.all(
    plan.opRecordingsPlans.map(async (opPlan) => {
      // create type recording assets first so that any types that don't yet have type files
      // can have these initialized. Operation recordings require valid typeId's to associate
      // rootTypeRecordingId's to the appropriate root types
      await createTypeAssetsFromPlan(opPlan);

      // create/update grogqli/operations/<opId>.json
      const { opFile, opRecording } = await createOrUpdateOpFile({
        opPlan,
      });

      // add an entry to grogqli/workflows/<workflowId>.json#operationRecordings
      newWorkflowFile.operationRecordings[opFile.id] = {
        opId: opFile.id,
        opRecordingId: opRecording.id,
      };
    })
  );

  await createNewWorkflowAssets({
    newWorkflowFileWithoutId: newWorkflowFile,
    workflowName: plan.name,
  });
};
