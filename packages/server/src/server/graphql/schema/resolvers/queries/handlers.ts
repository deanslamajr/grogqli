import { QueryResolvers } from '@grogqli/schema';
import { getByIds as getSessions } from '../../../../files/session';

export const resolver: QueryResolvers['handlers'] = async (parent, args) => {
  const {
    input: { sessionIds },
  } = args;
  return getSessions(sessionIds);
};
