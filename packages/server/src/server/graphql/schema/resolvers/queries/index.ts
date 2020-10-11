import { QueryResolvers } from '@grogqli/schema';
import { resolver as recordingsResolver } from './recordings';

export const queryResolver: QueryResolvers = {
  recordings: recordingsResolver,
};
