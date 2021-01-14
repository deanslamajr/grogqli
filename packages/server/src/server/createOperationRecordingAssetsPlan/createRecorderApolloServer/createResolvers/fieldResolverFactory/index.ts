import {
  GraphQLFieldResolver,
  IntrospectionQuery,
  IntrospectionOutputTypeRef,
  FieldNode,
} from 'graphql';

import { isRootType } from '../../../../isRootType';
import { Context } from '../..';
import { getRootTypeRecordingId } from './getRootTypeRecordingId';
import { updateRecordingsPlan } from './updateRecordingsPlan';

export interface ResolveValueFactoryParams {
  returnType: IntrospectionOutputTypeRef;
  schema: IntrospectionQuery;
  parentTypeName: string;
  fieldName: string;
}

export interface ReturnTypeInfo {
  isList: boolean;
  isScalar: boolean;
}

type GetReturnTypeInfo = (
  returnType: IntrospectionOutputTypeRef
) => ReturnTypeInfo;

const getReturnTypeInfo: GetReturnTypeInfo = (returnType) => {
  let isList = false;
  let isScalar = false;

  function parseType(type: IntrospectionOutputTypeRef) {
    if (type.kind === 'SCALAR') {
      isScalar = true;
    } else if (type.kind === 'LIST') {
      isList = true;
      return parseType(type.ofType);
    } else if (type.kind === 'NON_NULL') {
      return parseType(type.ofType);
    }
  }

  parseType(returnType);

  return {
    isList,
    isScalar,
  };
};

type GetFieldNameOrAlias = (params: {
  fieldName: string;
  fieldNodes: ReadonlyArray<FieldNode>;
}) => string;

const getFieldNameOrAlias: GetFieldNameOrAlias = ({
  fieldName,
  fieldNodes,
}) => {
  const currentNode = fieldNodes.find(({ name }) => name.value === fieldName);

  if (currentNode !== undefined && currentNode.alias !== undefined) {
    return currentNode.alias.value;
  } else {
    return fieldName;
  }
};

export const fieldResolverFactory = ({
  returnType,
  schema,
  parentTypeName,
  fieldName,
}: ResolveValueFactoryParams): GraphQLFieldResolver<any, Context> => {
  return async (parent, args, context, info) => {
    const opName = info.operation?.name?.value;

    const fieldNameOrAlias = getFieldNameOrAlias({
      fieldName,
      fieldNodes: info.fieldNodes,
    });

    // TODO handle unnamed query case
    if (!opName) {
      throw new Error('TODO handle unnamed query case');
    }

    const {
      recordingsPlan,
      rootTypeRecordingsIds,
    } = context.runTimeVariables.grogqli!;
    let fieldResolverValue;

    const returnTypeInfo: ReturnTypeInfo = getReturnTypeInfo(returnType);

    const isRootField = isRootType({ schema, typeName: parentTypeName });
    if (isRootField) {
      // TODO handle case
      //  where context.runTimeVariables.grogqli!.parsedOpRecording.data
      //  === null || undefined
      const fieldValue = context.runTimeVariables.grogqli!.parsedOpRecording
        .data[fieldNameOrAlias];

      const rootTypeRecordingId = getRootTypeRecordingId({
        rootTypeName: parentTypeName,
        rootTypeRecordingsIds,
        schema,
      });

      fieldResolverValue = updateRecordingsPlan({
        opName,
        parentTypeName,
        recordingsPlan,
        fieldName,
        fieldTypeInfo: returnTypeInfo,
        fieldValue,
        parentTypeRecordingId: rootTypeRecordingId,
        isRootType: true,
      });
    } else {
      const fieldValue = parent.value[fieldNameOrAlias];
      const parentTypeRecordingId = parent.parentTypeRecordingId;

      fieldResolverValue = updateRecordingsPlan({
        opName,
        parentTypeName,
        recordingsPlan,
        fieldName,
        fieldTypeInfo: returnTypeInfo,
        fieldValue,
        parentTypeRecordingId,
      });
    }

    return fieldResolverValue;
  };
};
