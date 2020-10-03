// import { QueryResolvers } from '../../schema.graphqls';
import { resolver as getRecordingsResolver } from './getRecordings';

export const queryResolver/*: Required<QueryResolvers>*/ = {
  getRecordings: getRecordingsResolver,
};
