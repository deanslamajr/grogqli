import shortid from 'shortid';
import faker from 'faker';

import * as GeneratedTypes from '../../../generated/schema';

export const inputThingResolver = async (_parent, args, _context, _info) => {
  const { input, optionalInput } = args as GeneratedTypes.QueryInputThingsArgs;

  const values = [] as GeneratedTypes.InputThing[];

  Array(input.limit || 10)
    .fill('')
    .forEach(() => {
      const type = input.type;

      let value: string = '';
      if (type === GeneratedTypes.InputThingType.Domain) {
        value = faker.internet.domainName();
      } else if (type === GeneratedTypes.InputThingType.Email) {
        value = faker.internet.email();
      } else if (type === GeneratedTypes.InputThingType.Ip) {
        value = faker.internet.ip();
      } else {
        value = faker.internet.mac();
      }

      values.push({
        id: shortid.generate(),
        type,
        value,
      });
    });

  // TODO sort values

  return values;
};
