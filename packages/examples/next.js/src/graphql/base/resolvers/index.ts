import { thingResolver } from './thing';
import { anotherThingResolver } from './anotherThing';
import { someUnionResolver } from './someUnion';

const Query = {
  anotherThing: anotherThingResolver,
  thing: thingResolver,
  someUnion: someUnionResolver,
};

const SomeUnion = {
  __resolveType(obj, context, info) {
    if (obj.streetName) {
      return 'Thing';
    }

    if (obj.product) {
      return 'AnotherThing';
    }

    if (obj.accountName) {
      return 'HeresAnotherThing';
    }

    return null; // GraphQLError is thrown
  },
};

export default { Query, SomeUnion };
