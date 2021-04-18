import { CreateWorkflowRecordingPlan } from '@grogqli/schema';

// This is a wip that should eventually be defined in the gql schema
type ReferenceValue = {
  typeId: string;
  recordingId: string;
};

export type TypeRecordingValue =
  | {
      type: 'reference';
      value: ReferenceValue | ReferenceValue[];
    }
  | {
      type: 'value';
      value: any;
    };

export type TypeRecordingPlan = {
  typeName: string;
  typeRecordingId: string;
  value: Record<string, TypeRecordingValue>;
};

export type OperationRecordingPlan =
  | CreateWorkflowRecordingPlan.CreateWorkflowRecordingPlanMutation['createWorkflowRecordingPlan']['newPlan']['operationRecordingPlans']
  | undefined;
