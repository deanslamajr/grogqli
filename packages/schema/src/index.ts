// schema
export { typeDefs } from './schema';
export * from './generated/src/schema/schema.graphql';

// operations
//// queries
export * as GetHandlers from './generated/src/queries/query/GetHandlers.graphql';
export * as GetSchemas from './generated/src/queries/query/GetSchemas.graphql';
export * as GetTempOpRecordings from './generated/src/queries/query/GetTempOpRecordings.graphql';
export * as GetWorkflows from './generated/src/queries/query/GetWorkflows.graphql';
//// mutations
export * as CreateHandlerSession from './generated/src/queries/mutation/CreateHandlerSession.graphql';
export * as CreateTemporarySchemaRecording from './generated/src/queries/mutation/CreateTemporarySchemaRecording.graphql';
export * as CreateTemporaryOperationRecording from './generated/src/queries/mutation/CreateTemporaryOperationRecording.graphql';
export * as CreateWorkflow from './generated/src/queries/mutation/CreateWorkflow.graphql';
export * as PlaybackRecording from './generated/src/queries/mutation/PlaybackRecording.graphql';
export * as UpdateHandlerSession from './generated/src/queries/mutation/UpdateHandlerSession.graphql';
export * as UpdateTemporaryOperationRecording from './generated/src/queries/mutation/UpdateTemporaryOperationRecording.graphql';
//// subscriptions
export * as OnTemporaryOperationRecordingSave from './generated/src/queries/subscription/OnTemporaryOperationRecordingSave.graphql';
export * as OnHandlerStateChange from './generated/src/queries/subscription/OnHandlerStateChange.graphql';
export * as OnHandlerSessionCreate from './generated/src/queries/subscription/OnHandlerSessionCreate.graphql';
