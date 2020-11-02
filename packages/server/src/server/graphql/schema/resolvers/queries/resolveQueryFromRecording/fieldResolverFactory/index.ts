import {
  GraphQLFieldResolver,
  GraphQLObjectType,
  IntrospectionQuery,
} from 'graphql';

import { Context } from '../createApolloServer';

import { getSchemaRecordingsPath } from '../../../files';

import { fetchRootTypeRecording } from './fetchRootTypeRecording';
// import fs from 'fs';
// let infoData = JSON.stringify(info);
// fs.writeFileSync('info.json', infoData);

// const isReferenceType = (value: any): boolean => true;

// function isNonNullType(gqlType: GraphQLOutputType): pet is Fish {
//   return (pet as Fish).swim !== undefined;
// }

// function isArrayType(gqlType: GraphQLOutputType): pet is Fish {
//   return (pet as Fish).swim !== undefined;
// }

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

interface ResolveValueFactoryParams {
  schema: IntrospectionQuery;
  parentTypeName: string;
  fieldName: string;
}
export const fieldResolverFactory = ({
  schema,
  parentTypeName,
  fieldName,
}: ResolveValueFactoryParams): GraphQLFieldResolver<{}, Context> => {
  return (parent, args, context, info) => {
    let fieldValueFromRecording;
    const opName = info.operation?.name?.value;
    // TODO handle unnamed query case
    if (!opName) {
      throw new Error('TODO handle unnamed query case');
    }
    // console.log('args', args);
    // console.log('parent', parent);
    // // console.log('context', context);
    // console.log('info.returnType', info.returnType);
    // console.log('fieldName', fieldName);
    // console.log('parentTypeName', parentTypeName);

    const isRootField = isTopLevelField({ schema, parentTypeName });
    if (isRootField) {
      // TODO handle args
      const rootTypeRecording = fetchRootTypeRecording({
        opName,
        operationsData,
        workflowId: context.runTimeVariables.grogqli!.workflowId,
      });

      // TODO handle case where recording doesn't exist
      if (!Boolean(rootTypeRecording)) {
        throw new Error(`TODO handle case where recording doesn't exist`);
      }

      // TODO (optionally) use args to destructure the recording associated with the given args

      fieldValueFromRecording = rootTypeRecording[fieldName];

      // TODO handle case where recording doesn't have a value for the given field
      if (!Boolean(fieldValueFromRecording)) {
        throw new Error(
          `TODO handle case where recording doesn't have a value for the given field`
        );
      }
    }

    // Nested field
    if (parent) {
      // if parent is a string but parentTypeName is not a string
      // (would it be enough to just check if "parent" is a string)
      // parent is a typeRecordingId and needs to be resolved
      if (typeof parent === 'string') {
        //   TODO handle args
        //   fieldValueFromRecording = fetchTypeRecordingById({
        //     type: info.returnType,
        //     id: fieldValue,
        //   });
      } else {
        // TODO do LIST types need to be handled differently than non LIST types? (probably not)
        // if info.returnType is a LIST type
        fieldValueFromRecording = parent[fieldName];
      }
    }

    console.log({
      isRootField,
      parent,
      parentTypeName,
      fieldName,
      fieldValueFromRecording,
      returnType: info.returnType,
    });
    return fieldValueFromRecording;
  };
};
