import shortid from 'shortid';

import { OperationRecordingPlan } from '../..';
import { ReturnTypeInfo } from '.';

interface EncodedFieldResolverValue {
  value: any;
  parentTypeRecordingId: string;
}

export type UpdateRecordingsPlan = <T extends any>(params: {
  opName: string;
  parentTypeName: string;
  parentTypeRecordingId: string;
  recordingsPlan: OperationRecordingPlan;
  fieldName: string;
  fieldTypeInfo: ReturnTypeInfo;
  fieldValue: T;
}) => T | EncodedFieldResolverValue | EncodedFieldResolverValue[];

export const updateRecordingsPlan: UpdateRecordingsPlan = ({
  opName,
  parentTypeName,
  parentTypeRecordingId,
  recordingsPlan,
  fieldName,
  fieldTypeInfo,
  fieldValue,
}) => {
  if (recordingsPlan.name === undefined) {
    recordingsPlan.name = opName;
  }
  // if an entry does not yet exist for the given parentTypeRecordingId,
  // create a new one
  if (recordingsPlan.typeRecordings[parentTypeRecordingId] === undefined) {
    recordingsPlan.typeRecordings[parentTypeRecordingId] = {
      typeName: parentTypeName,
      value: {},
    };
  }

  let parentTypeRecordingFieldValue;
  let fieldResolverValue;

  // handle the different return type cases
  // 1. the field return type is a scalar or list of scalars (or the value is null/undefined)
  //  e.g. we don't want to create a type recording of this data, the parent type can own the data
  //  * return the fieldValue as is
  if (
    fieldTypeInfo.isScalar ||
    fieldValue === null ||
    fieldValue === undefined
  ) {
    parentTypeRecordingFieldValue = fieldValue;
    fieldResolverValue = fieldValue;
  }
  // 2. the field return type is a non-scalars or list of non-scalars
  // 2a. if list of scalars, return [
  //    {value: fieldValue[0], parentTypeRecordingId: recordingId1},
  //    {value: fieldValue[1], parentTypeRecordingId: recordingId2},
  //    etc
  //  ]
  else if (!fieldTypeInfo.isScalar && fieldTypeInfo.isList) {
    if (!Array.isArray(fieldValue)) {
      throw new Error(
        'Return type is a LIST type but the given non-null, defined field value is not an array type.'
      );
    }

    parentTypeRecordingFieldValue = [];
    fieldResolverValue = [];

    fieldValue.forEach((returnListItem) => {
      const recordingId = shortid.generate();
      parentTypeRecordingFieldValue.push(recordingId);

      const formattedReturnListItem: EncodedFieldResolverValue = {
        value: returnListItem,
        parentTypeRecordingId: recordingId,
      };
      fieldResolverValue.push(formattedReturnListItem);
    });
  }
  // 2b. if a single non-scalar (e.g. non-list), return {value: fieldValue, parentTypeRecordingId}
  else {
    const recordingId = shortid.generate();
    parentTypeRecordingFieldValue = recordingId;

    fieldResolverValue = {
      value: fieldValue,
      parentTypeRecordingId: recordingId,
    } as EncodedFieldResolverValue;
  }

  recordingsPlan.typeRecordings[parentTypeRecordingId].value[
    fieldName
  ] = parentTypeRecordingFieldValue;

  return fieldResolverValue;
};
