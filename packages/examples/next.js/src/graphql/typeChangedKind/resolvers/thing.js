export const thingResolver = async (_parent, _args, _context, _info) => {
  const { Thing } = require('../../../generated/schema');
  return Thing.Burrito;
};
