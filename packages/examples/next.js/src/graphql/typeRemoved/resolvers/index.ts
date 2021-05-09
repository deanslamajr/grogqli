import baseResolvers from '../../base/resolvers';

type QueryType = Omit<typeof baseResolvers.Query, 'thing'> & {
  thing?: typeof baseResolvers.Query['thing'];
};
const Query: QueryType = {
  ...baseResolvers.Query,
};

delete Query.thing;

export default {
  ...baseResolvers,
  Query,
};
