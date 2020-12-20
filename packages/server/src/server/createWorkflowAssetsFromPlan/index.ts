import { OperationRecordingPlan } from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';

export interface WorkflowRecordingPlan {
  workflow: {
    name: string;
    description: string;
  };
  operations: OperationRecordingPlan[];
}

export const createWorkflowAssetsFromPlan = (plan: WorkflowRecordingPlan) => {
  // add entry to grogqli/workflows/index.json
  // * id - generate new unique workflowId
  // * name - from plan
  // create grogqli/workflows/<workflowId>.json
  // * id - workflowId generated earlier
  // * description - from plan
  // * operationRecordings - for each plan.operations (opPlan):
  //   * create/update grogqli/operations/<opId>.json
  //     * check if opPlan.name exists in grogqli/schemas/<opPlan.schemaId>/operations.json
  //       - if not
  //         - generate a new unique opId
  //         - add entry to grogqli/schemas/<opPlan.schemaId>/operations.json
  //         - create grogqli/operations/<opId>.json
  //           - recordings - empty object
  //     * grogqli/operations/<opId>.json#recordings
  //       - generate a new unique opRecordingId
  //       - recordings[opRecordingId].rootTypeRecordings - new empty object, for each opPlan.rootTypeRecordingIds (typeRecordingId)
  //         - add a key with the typeId of the type associated with the given typeRecordingId
  //           - find the entry for opPlan.typeRecordings[typeRecordingId].typeName in grogqli/schemas/<opPlan.schemaId>/types.json
  //             - if entry doesn't exist, generate a new unique typeId
  //             - add an entry to grogqli/schemas/<opPlan.schemaId>/types.json
  //             - create grogqli/types/<typeId>.json
  //               - recordings - empty object
  //         - set the value of the new key to a new object:
  //           - recordingId - typeRecordingId
  //   * opId, opRecordingId - set these values in grogqli/workflows/<workflowId>.json#operationRecordings
  // create type recording assets
  // * TBD...
};
