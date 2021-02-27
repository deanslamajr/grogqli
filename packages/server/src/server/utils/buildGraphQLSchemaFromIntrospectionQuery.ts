import { buildSchema, GraphQLSchema, IntrospectionQuery } from 'graphql';
import { createSchemaSDL } from './createSchemaSDL';

export const buildGraphQLSchemaFromIntrospectionQuery = async (
  introspectionQuery: IntrospectionQuery
): Promise<GraphQLSchema> => {
  const schemaSdl: string = await createSchemaSDL(introspectionQuery);
  return buildSchema(schemaSdl);
};
