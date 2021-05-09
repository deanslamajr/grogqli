import { MutationResolvers } from '@grogqli/schema';
import { createOperationRecordingAssetsPlan } from '../../../../createOperationRecordingAssetsPlan';
import { OperationRecordingPlan } from '../../../../createOperationRecordingAssetsPlan/createRecorderApolloServer';

export const resolver: MutationResolvers['createWorkflowRecordingPlan'] = async (
  _parent: {},
  args,
  _context: {},
  _info: {}
) => {
  const {
    input: { operations },
  } = args;

  const opRecordingsPlans = await Promise.all<OperationRecordingPlan>(
    operations.map(({ sessionId, tempRecordingId }) =>
      createOperationRecordingAssetsPlan({
        sessionId,
        tempRecordingId,
      })
    )
  );

  console.log('opRecordingsPlans', opRecordingsPlans);

  // TODO
  //  * try to find schemaRecording matches for all of the unique schemaHashes from the set of tempOpRecordings
  //    * first try to match by schemaHash, fallback to matching by schemaUrl
  //    * this data will reduce the work the SaveDrawer has to do for the schema dropdown

  return {
    newPlan: {
      operationRecordingPlans: [],
      schemaMatchResults: [],
      schemas: [],
    },
  };
};
