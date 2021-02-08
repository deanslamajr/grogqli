import { MutationResolvers, Handler } from '@grogqli/schema';

import {
  update as updateSession,
  UpdateParameters,
} from '../../../../files/session';
import { pubSub } from '../pubSub';
import {
  HANDLER_STATE_CHANGED,
  HandlerStateChangedPubSubPayload,
} from '../subscriptions/handlerStateChangedResolver';

export const updateHandlerSessionResolver: MutationResolvers['updateHandlerSession'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { sessionId, name, currentState, workflowId },
  } = args;

  const updateSessionPayload: UpdateParameters = {
    sessionId,
  };

  if (name) {
    updateSessionPayload.name = name;
  }
  if (currentState) {
    updateSessionPayload.currentState = currentState;
  }
  if (workflowId) {
    updateSessionPayload.workflowId = workflowId;
  }

  const updatedHandlerFile = await updateSession(updateSessionPayload);

  const updatedHandler = {
    id: updatedHandlerFile.id,
    name: updatedHandlerFile.name,
    currentState: updatedHandlerFile.currentState,
    workflowId: updatedHandlerFile.workflowId,
  };

  // TODO implement payload and filtering in resolver
  const payload: HandlerStateChangedPubSubPayload = {
    handlerStateChanged: updatedHandler,
  };
  pubSub.publish(HANDLER_STATE_CHANGED, payload);

  return {
    updatedHandler,
  };
};
