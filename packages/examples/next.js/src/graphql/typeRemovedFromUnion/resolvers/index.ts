import baseResolvers from '../../base/resolvers';

import { someUnionResolver } from './someUnion';

const SomeUnion = {
  __resolveType(obj, context, info) {
    if (obj.accountName) {
      return 'HeresAnotherThing';
    }

    return null; // GraphQLError is thrown
  },
};

export default {
  ...baseResolvers,
  Query: {
    ...baseResolvers.Query,
    someUnion: someUnionResolver,
  },
  SomeUnion,
};
