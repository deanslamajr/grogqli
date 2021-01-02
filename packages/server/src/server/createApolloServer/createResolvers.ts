import { IObjectTypeResolver } from 'graphql-tools';
import { Config } from 'apollo-server-core';

import { SchemaFile } from '../files';
import { openTypeNameToIdMapping } from '../files/type';
import { loadOperationsMappingFile } from '../files/operation';
import { fieldResolverFactory } from './fieldResolverFactory';

type Resolvers = NonNullable<Config['resolvers']>;

// TODO add logic to check a new "version" field on the schema and version the createResolver algorithm
// perhaps put the versioning in the filename so that the structure of the file doesn't need modification
// This might be more ideal as the original (current) version (v1) maps directly to the IntrospectionQuery type
export const createResolvers = async ({
  introspectionQuery: schema,
  id: schemaId,
}: SchemaFile): Promise<Resolvers> => {
  const [operationsData, typeNameToIdMappingData] = await Promise.all([
    loadOperationsMappingFile(schemaId),
    openTypeNameToIdMapping(schemaId),
  ]);

  if (operationsData === null) {
    // TODO handle case where file doesnt exist for the given schemaId
    throw new Error(
      `TODO handle case where a operations file doesnt exist for the given schemaId. schemaId:${schemaId}`
    );
  }

  return schema.__schema.types.reduce<Resolvers>((resolvers, CurrentType) => {
    // add a resolver for each object type in the schema
    // note: skip graphql internal types (those prefixed with '__')
    if (CurrentType.kind === 'OBJECT' && !CurrentType.name.includes('__')) {
      const currentTypeName = CurrentType.name;

      const resolverForCurrentType = CurrentType.fields.reduce<
        IObjectTypeResolver
      >((resolver, { name: fieldName }) => {
        const resolveField = fieldResolverFactory({
          operationsData,
          typeNameToIdMappingData,
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
