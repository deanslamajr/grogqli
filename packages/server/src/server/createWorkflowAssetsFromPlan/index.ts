import { OperationRecordingPlan } from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import { WorkflowFileBeforeCreation } from '../files/workflow';
import { createOrUpdateOpFile } from './createOrUpdateOperationFile';

import { createTypeAssetsFromPlan } from './createTypeAssetsFromPlan';

export interface WorkflowRecordingPlan {
  name: string;
  description: string;
  operations: OperationRecordingPlan[];
}

export const createWorkflowAssetsFromPlan = (plan: WorkflowRecordingPlan) => {
  const newWorkflowFile: WorkflowFileBeforeCreation = {
    version: 1,
    name: plan.name,
    description: plan.description,
    operationRecordings: {},
  };

  plan.operations.forEach(async (opPlan) => {
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
  });

  // TODO implement createNewWorkflowFile
  // * generates a new unique workflowId
  // * adds an entry to grogqli/workflows/index.json (mapping of workflow names->ids)
  // * creates a new workflow file, e.g. grogqli/workflows/newWorkflowId.json
  //   * should workflow.name only be referenced in grogqli/workflows/index.json ???
  await createNewWorkflowFile({
    newWorkflowFile,
  });
};
