import Mutation from './Mutation.graphql';

import CreateRecording from './CreateRecording.graphql';
import CreateWorkflow from './CreateWorkflow.graphql';
import PlaybackRecording from './PlaybackRecording.graphql';
import RecordResponse from './RecordResponse.graphql';

export const typeDefs = [
  Mutation,
  CreateRecording,
  CreateWorkflow,
  PlaybackRecording,
  RecordResponse,
];
