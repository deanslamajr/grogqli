import { typeDefs as sharedTypes } from './shared';
import { typeDefs as queryTypes } from './queries';
import { typeDefs as mutationTypes } from './mutations';

export const typeDefs = [
  ...queryTypes,
  ...mutationTypes,
  ...sharedTypes,
];