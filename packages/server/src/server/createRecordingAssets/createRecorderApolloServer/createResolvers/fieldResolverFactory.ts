import { GraphQLFieldResolver, IntrospectionQuery } from 'graphql';
import shortid from 'shortid';

import { Context, RecordingsPlan } from '..';

interface IsTopLevelFieldParams {
  schema: IntrospectionQuery;
  parentTypeName: string;
}

export interface ResolveValueFactoryParams {
  schema: IntrospectionQuery;
  parentTypeName: string;
  fieldName: string;
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

interface UpdateRecordingPlanParams {
  fieldName: string;
  fieldTypeName: string;
  fieldTypeRecordingId: string;
  fieldTypeRecording: any;
  recordingsPlan: RecordingsPlan;
  parentTypeName: string;
}
const updateRecordingPlan = ({
  fieldName,
  fieldTypeName,
  fieldTypeRecordingId,
  fieldTypeRecording,
  recordingsPlan,
  parentTypeName,
}: UpdateRecordingPlanParams): void => {
  // update the parent type's reference to this field
  // TODO check if is an array and if so, push the value into the array
  recordingsPlan.typeRecordings[parentTypeName].value[
    fieldName
  ] = fieldTypeRecordingId;
  // add this fields type recording
  recordingsPlan.typeRecordings[fieldTypeName] = {
    recordingId: fieldTypeRecordingId,
    value: fieldTypeRecording,
  };
};

export const fieldResolverFactory = ({
  schema,
  parentTypeName,
  fieldName,
}: ResolveValueFactoryParams): GraphQLFieldResolver<any, Context> => {
  return async (parent, args, context, info) => {
    const { recordingsPlan } = context.runTimeVariables.grogqli!;
    let responseRecordingSlice;

    // const opName = info.operation?.name?.value;
    // TODO handle unnamed query case
    // if (!opName) {
    //   throw new Error('TODO handle unnamed query case');
    // }

    const isRootField = isTopLevelField({ schema, parentTypeName });
    if (isRootField) {
      const parsedOpResponseRecording = JSON.parse(
        context.runTimeVariables.grogqli!.operationResponseRecording
      );
      responseRecordingSlice = parsedOpResponseRecording.data[fieldName];
    } else {
      responseRecordingSlice = parent[fieldName];
    }

    const typeNameOfField = responseRecordingSlice.__typename;
    delete responseRecordingSlice.__typename;
    const fieldTypeRecordingId: string = shortid.generate();

    updateRecordingPlan({
      fieldName,
      fieldTypeName: typeNameOfField,
      fieldTypeRecordingId,
      fieldTypeRecording: responseRecordingSlice,
      parentTypeName,
      recordingsPlan,
    });

    return responseRecordingSlice;
  };
};
