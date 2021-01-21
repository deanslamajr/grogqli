import Mutation from './Mutation.graphql';

import CreateHandlerSession from './CreateHandlerSession.graphql';
import CreateRecording from './CreateRecording.graphql';
import CreateWorkflow from './CreateWorkflow.graphql';
import PlaybackRecording from './PlaybackRecording.graphql';
import RecordResponse from './RecordResponse.graphql';

export const typeDefs = [
  Mutation,
  CreateHandlerSession,
  CreateRecording,
  CreateWorkflow,
  PlaybackRecording,
  RecordResponse,
];
