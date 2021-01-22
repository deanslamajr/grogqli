import { MutationResolvers, Handler } from '@grogqli/schema';

import { create as createNewSession } from '../../../../files/session';
import { pubSub } from '../pubSub';
import { HANDLER_SESSION_CREATED } from '../subscriptions/handlerSessionCreatedResolver';

export const createHandlerSessionResolver: MutationResolvers['createHandlerSession'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const newHandlerSession: Handler = await createNewSession(args.input.name);

  pubSub.publish(HANDLER_SESSION_CREATED, {
    handlerSessionCreated: newHandlerSession,
  });

  return {
    newHandler: newHandlerSession,
  };
};
