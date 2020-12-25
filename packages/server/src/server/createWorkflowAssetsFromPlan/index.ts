import shortid from 'shortid';
import { OperationRecordingPlan } from '../createOperationRecordingAssetsPlan/createRecorderApolloServer';
import { getTypeIdFromTypeName, openTypeNameToIdMapping } from '../files';
import {
  createNewOpFile,
  getOpFileFromOpName,
  OperationRecording,
} from '../files/operation';
import { WorkflowFileBeforeCreation } from '../files/workflow';

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
    // #####
    // ###
    // #
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

    // Create and add a new operation recording entry
    // i.e. grogqli/operations/<opId>.json#recordings
    // #####
    // ###
    // #

    // generate a new unique opRecordingId
    // TODO: verify that this is a unique id
    const newOpRecordingId = shortid.generate();

    // recordings[opRecordingId].rootTypeRecordings - new empty object
    const opRecording: OperationRecording = {
      id: newOpRecordingId,
      rootTypeRecordings: {},
    };

    // for each opPlan.rootTypeRecordingIds (typeRecordingId)
    opPlan.rootTypeRecordingIds.forEach(async (rootTypeRecordingId) => {
      const rootTypeRecording = opPlan.typeRecordings[rootTypeRecordingId];
      if (rootTypeRecording === undefined) {
        // TODO handle case where the given rootTypeRecordingId does not have an associated typeRecording entry in the recording plan.
        throw new Error(`
          TODO handle case where the given rootTypeRecordingId does not have an associated typeRecording entry in the recording plan.
          rootTypeRecordingId:${rootTypeRecordingId}
        `);
      }
      const typeName = rootTypeRecording.typeName;
      const typeNameToIdMappingData = await openTypeNameToIdMapping(
        opPlan.schemaId
      );

      const rootTypeId = await getTypeIdFromTypeName({
        typeNameToIdMappingData,
        typeName,
      });

      // add a key with the typeId of the type associated with the given typeRecordingId
      opRecording.rootTypeRecordings[rootTypeId] = {
        rootTypeId,
        recordingId: rootTypeRecordingId,
      };
    });

    opFile.recordings[newOpRecordingId] = opRecording;

    // TODO save opFile

    // add an entry to grogqli/workflows/<workflowId>.json#operationRecordings
    newWorkflowFile.operationRecordings[opFile.id] = {
      opId: opFile.id,
      opRecordingId: newOpRecordingId,
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
