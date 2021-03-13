import baseResolvers from '../../base/resolvers';

import { yetAnotherThingResolver } from './yetAnotherThing';

export default {
  ...baseResolvers,
  Query: {
    ...baseResolvers.Query,
    anotherThing: yetAnotherThingResolver,
  },
};
