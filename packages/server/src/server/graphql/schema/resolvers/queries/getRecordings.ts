import {QueryResolvers} from '@grogqli/schema';

export const resolver: QueryResolvers['getRecordings'] = async (_parent, _args, context, _info) => {
  return [
    {
      replaceThisBullshxt: 'please replace this test data!'
    }
  ];
};
