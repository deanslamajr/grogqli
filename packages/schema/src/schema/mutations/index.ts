import Mutation from './Mutation.graphql';

import CreateHandlerSession from './CreateHandlerSession.graphql';
import CreateSchemaRecording from './CreateSchemaRecording.graphql';
import CreateTemporaryOperationRecording from './CreateTemporaryOperationRecording.graphql';
import CreateWorkflow from './CreateWorkflow.graphql';
import PlaybackRecording from './PlaybackRecording.graphql';
import UpdateHandlerSession from './UpdateHandlerSession.graphql';
import UpdateTemporaryOperationRecording from './UpdateTemporaryOperationRecording.graphql';

export const typeDefs = [
  Mutation,
  CreateHandlerSession,
  CreateSchemaRecording,
  CreateTemporaryOperationRecording,
  CreateWorkflow,
  PlaybackRecording,
  UpdateHandlerSession,
  UpdateTemporaryOperationRecording,
];
