import { buildClientSchema, printSchema, IntrospectionQuery } from 'graphql';

export const createSchemaSDL = async (
  schema: IntrospectionQuery
): Promise<string> => {
  const graphqlSchemaObj = buildClientSchema(schema);
  return printSchema(graphqlSchemaObj);
};
