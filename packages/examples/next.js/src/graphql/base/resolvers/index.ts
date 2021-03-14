import { thingResolver } from './thing';
import { anotherThingResolver } from './anotherThing';
import { someUnionResolver } from './someUnion';
import { inputThingResolver } from './inputThing';

const Query = {
  anotherThing: anotherThingResolver,
  thing: thingResolver,
  someUnion: someUnionResolver,
  inputThings: inputThingResolver,
};

const SomeUnion = {
  __resolveType(obj, context, info) {
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
