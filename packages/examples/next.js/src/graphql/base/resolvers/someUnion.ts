import shortid from 'shortid';
import faker from 'faker';

import { anotherThingResolver } from './anotherThing';

import { getRandomNumber } from '../../../lib/randomNumber';

const resolversOfUnion = [
  // 0: AnotherThing
  anotherThingResolver,
  // 1: HeresAnotherThing
  async () => {
    return {
      id: shortid.generate(),
      accountName: faker.finance.accountName(),
      currencySymbol: faker.finance.currencySymbol(),
    };
  },
];

export const someUnionResolver = async (_parent, _args, _context, _info) => {
  const randomUnionIndex = getRandomNumber({ max: 1 });

  const resolverFunction = resolversOfUnion[randomUnionIndex];

  return resolverFunction(_parent, _args, _context, _info);
};
