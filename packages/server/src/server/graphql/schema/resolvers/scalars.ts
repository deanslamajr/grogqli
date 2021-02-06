import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { Resolvers } from '@grogqli/schema';

interface ScalarResolvers {
  JSON: Resolvers['JSON'];
  JSONObject: Resolvers['JSONObject'];
}

const scalars: ScalarResolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};

export default scalars;
