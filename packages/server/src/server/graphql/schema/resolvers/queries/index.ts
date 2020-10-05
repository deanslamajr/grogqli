import {QueryResolvers} from '@grogqli/schema';
import { resolver as getRecordingsResolver } from './getRecordings';

export const queryResolver: QueryResolvers = {
  getRecordings: getRecordingsResolver,
};
