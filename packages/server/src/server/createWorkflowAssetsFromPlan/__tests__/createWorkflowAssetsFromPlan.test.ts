import { createWorkflowAssetsFromPlan } from '../';

describe('createWorkflowAssetsFromPlan', () => {
  const name = 'workflowName';
  const description = 'a workflow description';
  const schemaId = 'someSchemaId';

  describe('operations', () => {
    it('should create a new type recording in the type file associated with each item in plan.typeRecordings', async () => {
      await createWorkflowAssetsFromPlan({
        name,
        description,
        opRecordingsPlans: [
          {
            schemaId,
            typeRecordings: {},
            rootTypeRecordingIds: new Set<string>(),
          },
        ],
      });
    });

    describe('if a type file doesnt exist for a type associated with a type recording that is to be created', () => {
      xit('should create a new type file', () => {});
    });

    describe('if any operation`s schemaId does not exist', () => {
      xit('should throw', () => {});
    });
  });
});
