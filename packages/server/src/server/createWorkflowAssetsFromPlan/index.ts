import { OperationRecordingPlan } from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import { createNewOpFile, getOpFileFromOpName } from '../files/operation';

export interface WorkflowRecordingPlan {
  name: string;
  description: string;
  operations: OperationRecordingPlan[];
}

export const createWorkflowAssetsFromPlan = (plan: WorkflowRecordingPlan) => {
  // add entry to grogqli/workflows/index.json (mapping of workflow names->ids)
  // * id - generate new unique workflowId
  // * name - plan.name

  // create grogqli/workflows/<workflowId>.json
  // * id - workflowId generated earlier
  // * description - plan.description
  // * operationRecordings - for each plan.operations (opPlan):
  plan.operations.forEach(async (opPlan) => {
    // create/update grogqli/operations/<opId>.json
    // * check if opPlan.name exists in grogqli/schemas/<opPlan.schemaId>/operations.json
    let opFile = await getOpFileFromOpName({
      schemaId: opPlan.schemaId,
      opName: opPlan.name!,
    });
    //   - if not
    if (opFile === null) {
      opFile = createNewOpFile({
        schemaId: opPlan.schemaId,
        opName: opPlan.name!,
      });
    }

    // * grogqli/operations/<opId>.json#recordings
    //   - generate a new unique opRecordingId
    //   - recordings[opRecordingId].rootTypeRecordings - new empty object, for each opPlan.rootTypeRecordingIds (typeRecordingId)
    //     - add a key with the typeId of the type associated with the given typeRecordingId
    //       - find the entry for opPlan.typeRecordings[typeRecordingId].typeName in grogqli/schemas/<opPlan.schemaId>/types.json
    //         - if entry doesn't exist, generate a new unique typeId
    //         - add an entry to grogqli/schemas/<opPlan.schemaId>/types.json
    //         - create grogqli/types/<typeId>.json
    //           - recordings - empty object
    //     - set the value of the new key to a new object:
    //       - recordingId - typeRecordingId

    // add an entry to grogqli/workflows/<workflowId>.json#operationRecordings
    // * use the values of opId, opRecordingId from above

    // create type recording assets
    Object.values(opPlan.typeRecordings).forEach((typeRecording) => {
      //  * use typeRecording.typeName to get typeId from grogqli/schemas/<opPlan.schemaId>/types.json
      //    - if entry doesn't exist, generate a new unique typeId
      //      - add an entry to grogqli/schemas/<opPlan.schemaId>/types.json
      //      - create grogqli/types/<typeId>.json
      //        - recordings - empty object
      //    - if entry exists/ open grogqli/types/<typeId>.json
      //  * add a new recording entry to grogqli/types/<typeId>.json#recordings
      //    - use typeRecording.id as the new recording entry's recordingId
      //    - use typeRecording.value as the new recording entry's value
    });
  });
};
