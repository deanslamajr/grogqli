import Mutation from './Mutation.graphql';

import CreateHandlerSession from './CreateHandlerSession.graphql';
import CreateTemporarySchemaRecording from './CreateTemporarySchemaRecording.graphql';
import CreateTemporaryOperationRecording from './CreateTemporaryOperationRecording.graphql';
import CreateWorkflowRecordingPlan from './CreateWorkflowRecordingPlan.graphql';
import CreateWorkflow from './CreateWorkflow.graphql';
import PlaybackRecording from './PlaybackRecording.graphql';
import UpdateHandlerSession from './UpdateHandlerSession.graphql';
import UpdateTemporaryOperationRecording from './UpdateTemporaryOperationRecording.graphql';

export const typeDefs = [
  Mutation,
  CreateHandlerSession,
  CreateTemporarySchemaRecording,
  CreateTemporaryOperationRecording,
  CreateWorkflowRecordingPlan,
  CreateWorkflow,
  PlaybackRecording,
  UpdateHandlerSession,
  UpdateTemporaryOperationRecording,
];
