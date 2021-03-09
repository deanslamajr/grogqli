import { thingResolver } from './thing';
import { anotherThingResolver } from './anotherThing';

const Query = {
  anotherThing: anotherThingResolver,
  thing: thingResolver,
};

export default { Query };
