// schema
export { typeDefs } from './schema';
export * from './generated/src/schema/schema.graphql';

// operations
//// queries
export * as GetRecordings from './generated/src/queries/query/GetRecordings.graphql';
export * as GetWorkflows from './generated/src/queries/query/GetWorkflows.graphql';
//// mutations
export * as CreateRecording from './generated/src/queries/mutation/CreateRecording.graphql';
export * as CreateWorkflow from './generated/src/queries/mutation/CreateWorkflow.graphql';
export * as PlaybackRecording from './generated/src/queries/mutation/PlaybackRecording.graphql';
export * as RecordResponse from './generated/src/queries/mutation/RecordResponse.graphql';
//// subscriptions
export * as OnRecordingSaved from './generated/src/queries/subscription/OnRecordingSave.graphql';
