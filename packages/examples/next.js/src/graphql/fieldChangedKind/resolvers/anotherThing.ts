import faker from 'faker';

export const anotherThingResolver = async (_parent, _args, _context, _info) => {
  return faker.commerce.product();
};
