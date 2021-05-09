import baseResolvers from '../../base/resolvers';

import { thingResolver } from './thing';

export default {
  ...baseResolvers,
  Query: {
    ...baseResolvers.Query,
    thing: thingResolver,
  },
};
