import { IObjectTypeResolver } from 'graphql-tools';
import { Config } from 'apollo-server-core';

import { SchemaFile } from '../../../files';
import { fieldResolverFactory } from './fieldResolverFactory';

type Resolvers = NonNullable<Config['resolvers']>;

export const createResolvers = async ({
  introspectionQuery: schema,
}: SchemaFile): Promise<Resolvers> => {
  return schema.__schema.types
    .filter(({ name }) => !name.includes('__'))
    .reduce<Resolvers>((resolvers, CurrentType) => {
      // add a resolver for each object type in the schema
      // note: skip graphql internal types (those prefixed with '__')
      if (CurrentType.kind === 'OBJECT') {
        const currentTypeName = CurrentType.name;

        const resolverForCurrentType = CurrentType.fields.reduce<
          IObjectTypeResolver
        >((resolver, { name: fieldName, type }) => {
          const resolveField = fieldResolverFactory({
            returnType: type,
            schema,
            parentTypeName: currentTypeName,
            fieldName,
          });
          resolver[fieldName] = resolveField;
          return resolver;
        }, {} as IObjectTypeResolver);

        resolvers[currentTypeName] = resolverForCurrentType;
      }
      return resolvers;
    }, {} as Resolvers);
};
