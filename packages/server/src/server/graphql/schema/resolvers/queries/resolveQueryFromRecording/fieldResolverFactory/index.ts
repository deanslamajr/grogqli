import { GraphQLFieldResolver, IntrospectionQuery } from 'graphql';

import { OperationsData, TypeNameToIdMapping } from '../../../files';
import { Context } from '../createApolloServer';

import { fetchRootTypeRecording } from './fetchRootTypeRecording';
import { fetchNestedTypeRecording } from './fetchNestedTypeRecording';

interface IsTopLevelFieldParams {
  schema: IntrospectionQuery;
  parentTypeName: string;
}
const isTopLevelField = ({
  schema,
  parentTypeName,
}: IsTopLevelFieldParams): boolean => {
  const { queryType, mutationType, subscriptionType } = schema.__schema;
  return (
    parentTypeName === queryType.name ||
    parentTypeName === mutationType?.name ||
    parentTypeName === subscriptionType?.name
  );
};

export interface ResolveValueFactoryParams {
  operationsData: OperationsData;
  typeNameToIdMappingData: TypeNameToIdMapping;
  schema: IntrospectionQuery;
  parentTypeName: string;
  fieldName: string;
}
export const fieldResolverFactory = ({
  operationsData,
  typeNameToIdMappingData,
  schema,
  parentTypeName,
  fieldName,
}: ResolveValueFactoryParams): GraphQLFieldResolver<any, Context> => {
  return async (parent, args, context, info) => {
    let fieldValueFromRecording;

    const opName = info.operation?.name?.value;
    // TODO handle unnamed query case
    if (!opName) {
      throw new Error('TODO handle unnamed query case');
    }

    const isRootField = isTopLevelField({ schema, parentTypeName });
    if (isRootField) {
      const rootTypeRecording = await fetchRootTypeRecording({
        opName,
        operationsData,
        workflowId: context.runTimeVariables.grogqli!.workflowId,
      });

      // TODO (optionally) use args to destructure the recording associated with the given args
      fieldValueFromRecording = rootTypeRecording[fieldName];

      // TODO handle case where recording doesn't have a value for the given field
      if (fieldValueFromRecording === undefined) {
        throw new Error(
          `TODO handle case where recording doesn't have a value for the given field.
          parentTypeName:${parentTypeName} fieldName:${fieldName}`
        );
      }
    }

    // Nested field
    else {
      const nestedTypeRecording = await fetchNestedTypeRecording({
        recordingId: parent,
        typeName: parentTypeName,
        typeNameToIdMappingData,
      });

      // TODO handle case where recording doesn't have a value for the given field
      fieldValueFromRecording = nestedTypeRecording[fieldName];

      // TODO handle case when a fieldValue does not exist for the given typeRecording
      if (fieldValueFromRecording === undefined) {
        throw new Error(
          `TODO handle case when a fieldValue does not exist for the given typeRecording.
          parentTypeName:${parentTypeName} fieldName:${fieldName}`
        );
      }
    }

    return fieldValueFromRecording;
  };
};
