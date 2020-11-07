import { IResolvers, IObjectTypeResolver } from 'graphql-tools';

import { getOperationsData, OperationsData, SchemaFile } from '../../files';
import { fieldResolverFactory } from './fieldResolverFactory';

// TODO add logic to check a new "version" field on the schema and version the createResolver algorithm
// perhaps put the versioning in the filename so that the structure of the file doesn't need modification
// This might be more ideal as the original (current) version (v1) maps directly to the IntrospectionQuery type
export const createResolvers = async ({
  introspectionQuery: schema,
  id: schemaId,
}: SchemaFile): Promise<IResolvers> => {
  const operationsData: OperationsData = await getOperationsData();
  return schema.__schema.types.reduce<IResolvers>((resolvers, CurrentType) => {
    // add a resolver for each object type in the schema
    // note: skip graphql internal types (those prefixed with '__')
    if (CurrentType.kind === 'OBJECT' && !CurrentType.name.includes('__')) {
      const currentTypeName = CurrentType.name;

      const resolverForCurrentType = CurrentType.fields.reduce<
        IObjectTypeResolver
      >((resolver, { name: fieldName }) => {
        const resolveField = fieldResolverFactory({
          operationsData,
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
  }, {} as IResolvers);
};
