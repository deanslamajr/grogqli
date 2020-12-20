import { IntrospectionQuery } from 'graphql';

import { RootTypeRecordingsIds } from '../..';

type GetGenericRootTypeName = (params: {
  schema: IntrospectionQuery;
  rootTypeName: string;
}) => 'query' | 'mutation' | 'subscription';

const getGenericRootTypeName: GetGenericRootTypeName = ({
  schema,
  rootTypeName,
}) => {
  const { queryType, mutationType, subscriptionType } = schema.__schema;
  let genericRootTypeName;

  if (rootTypeName === queryType.name) {
    genericRootTypeName = 'query';
  } else if (rootTypeName === mutationType?.name) {
    genericRootTypeName = 'mutation';
  } else if (rootTypeName === subscriptionType?.name) {
    genericRootTypeName = 'subscription';
  } else {
    throw new Error(
      `updateRecordingsPlanForRootTypeField was invoked for a root type:(${rootTypeName}) not found in the given schema.`
    );
  }
  return genericRootTypeName;
};

type GetRootTypeRecordingId = (params: {
  rootTypeName: string;
  rootTypeRecordingsIds: RootTypeRecordingsIds;
  schema: IntrospectionQuery;
}) => string;

export const getRootTypeRecordingId: GetRootTypeRecordingId = ({
  rootTypeName,
  rootTypeRecordingsIds,
  schema,
}) => {
  const genericRootTypeName = getGenericRootTypeName({
    schema,
    rootTypeName,
  });
  return rootTypeRecordingsIds[genericRootTypeName];
};
