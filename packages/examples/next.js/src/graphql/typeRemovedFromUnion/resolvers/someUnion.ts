import shortid from 'shortid';
import faker from 'faker';

const resolversOfUnion = [
  // 0: HeresAnotherThing
  async () => {
    return {
      id: shortid.generate(),
      accountName: faker.finance.accountName(),
      currencySymbol: faker.finance.currencySymbol(),
    };
  },
];

export const someUnionResolver = async (_parent, _args, _context, _info) => {
  const resolverFunction = resolversOfUnion[0];

  return resolverFunction();
};
