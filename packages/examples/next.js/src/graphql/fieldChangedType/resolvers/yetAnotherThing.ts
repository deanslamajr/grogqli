import shortid from 'shortid';
import faker from 'faker';

export const yetAnotherThingResolver = async (
  _parent,
  _args,
  _context,
  _info
) => {
  return {
    id: shortid.generate(),
    isFruit: false,
    description: faker.company.catchPhraseDescriptor(),
  };
};
