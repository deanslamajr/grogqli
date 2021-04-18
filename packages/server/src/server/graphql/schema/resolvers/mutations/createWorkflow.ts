import { MutationResolvers, CreateWorkflowResultCode } from '@grogqli/schema';

// import { createOperationRecordingAssetsPlan } from '../../../../createOperationRecordingAssetsPlan';
import { createWorkflowAssetsFromPlan } from '../../../../createWorkflowAssetsFromPlan';

import { conditionallyCreateOrUpdateSchemaRecordings } from '../../../../files/schema';

export interface TypeRecordingPlan {
  typeName: string;
  typeRecordingId: string;
  value: any;
}

export interface OperationRecordingPlan {
  schemaId: string;
  name?: string;
  rootTypeRecordingIds: Set<string>;
  typeRecordings: {
    [typeRecordingId: string]: TypeRecordingPlan;
  };
}

export const createWorkflowResolver: MutationResolvers['createWorkflow'] = async (
  _parent: {},
  args,
  _context: {},
  _info: {}
) => {
  const {
    input: { workflow, schemasMappings, operations },
  } = args;

  // First, handle persisting new schemas and/or updates to existing schemas
  const updatedSchemasMapping = await conditionallyCreateOrUpdateSchemaRecordings(
    schemasMappings
  );

  // Shouldn't need this anymore as this is done in CreateOperationRecordingAssetsPlanResolver
  // Next, generate plans for creating recording assets
  // const opRecordingsPlans = await Promise.all<OperationRecordingPlan>(
  //   operations.map(({ sessionId, tempRecordingId }) =>
  //     createOperationRecordingAssetsPlan({
  //       schemasMapping: updatedSchemasMapping,
  //       sessionId,
  //       tempRecordingId,
  //     })
  //   )
  // );

  // Finally, create the recording assets from the plans
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
