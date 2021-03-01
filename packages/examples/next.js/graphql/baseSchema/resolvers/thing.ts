import shortid from 'shortid';
import faker from 'faker';

export const thingResolver = async (_parent, _args, _context, _info) => {
  return {
    id: shortid.generate(),
    name: faker.name.findName(),
  };
};
