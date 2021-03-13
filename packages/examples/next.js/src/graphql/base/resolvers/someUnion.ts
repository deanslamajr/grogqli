import shortid from 'shortid';
import faker from 'faker';

import { anotherThingResolver } from './anotherThing';

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
  let randomUnionIndex = Math.floor(Math.random() * 2);

  // protect against the rare case of 2 occurring
  // bc the random number generation above originally targeted 3 cases
  // but now only 0 & 1 are valid. Plus, the alg seems to rarely actually
  // generate the highest value :shrug:
  if (randomUnionIndex === 2) {
    randomUnionIndex = 1;
  }

  const resolverFunction = resolversOfUnion[randomUnionIndex];

  return resolverFunction(_parent, _args, _context, _info);
};
