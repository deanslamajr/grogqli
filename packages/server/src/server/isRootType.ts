import { IntrospectionQuery } from 'graphql';

type IsRootType = (params: {
  schema: IntrospectionQuery;
  typeName: string;
}) => boolean;

export const isRootType: IsRootType = ({ schema, typeName }) => {
  const { queryType, mutationType, subscriptionType } = schema.__schema;
  return (
    typeName === queryType.name ||
    typeName === mutationType?.name ||
    typeName === subscriptionType?.name
  );
};
