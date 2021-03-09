import baseResolvers from '../../base/resolvers';

import { anotherThingResolver } from './anotherThing';

export default {
  ...baseResolvers,
  Query: {
    ...baseResolvers.Query,
    anotherThing: anotherThingResolver,
  },
};
