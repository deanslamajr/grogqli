// schema
export {typeDefs} from './schema';
export * from './generated/src/schema/schema.graphql';

// queries
export * as GetRecordings from './generated/src/queries/query/GetRecordings.graphql';
export * as CreateRecording from './generated/src/queries/mutation/CreateRecording.graphql';
export * as OnRecordingSaved from './generated/src/queries/subscription/OnRecordingSave.graphql';