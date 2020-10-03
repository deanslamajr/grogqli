import { typeDefs as sharedTypes } from './shared';
import { typeDefs as queryTypes } from './queries';
import { typeDefs as mutationTypes } from './mutations';

console.log('sharedType', sharedTypes)

export const typeDefs = [
  ...queryTypes,
  ...mutationTypes,
  ...sharedTypes,
];