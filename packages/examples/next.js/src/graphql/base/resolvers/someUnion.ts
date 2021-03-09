import shortid from 'shortid';
import faker from 'faker';

import { thingResolver } from './thing';
import { anotherThingResolver } from './anotherThing';

const resolversOfUnion = [
  // 0: Thing
  thingResolver,
  // 1: AnotherThing
  anotherThingResolver,
  // 2: HeresAnotherThing
  async () => {
    return {
      id: shortid.generate(),
      accountName: faker.finance.accountName(),
      currencySymbol: faker.finance.currencySymbol(),
    };
  },
];

export const someUnionResolver = async (_parent, _args, _context, _info) => {
  const randomUnionIndex = Math.floor(Math.random() * 2);

  const resolverFunction = resolversOfUnion[randomUnionIndex];

  return resolverFunction(_parent, _args, _context, _info);
};
