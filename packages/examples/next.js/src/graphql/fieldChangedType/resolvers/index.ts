import { thingResolver } from './thing';
import { yetAnotherThingResolver } from './yetAnotherThing';

const Query = {
  anotherThing: yetAnotherThingResolver,
  thing: thingResolver,
};

export default { Query };
