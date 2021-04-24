import React from 'react';
import styled from 'styled-components';
import {
  OperationRecordingPlans,
  TypeRecordingPlan,
  TypeRecordingValue,
} from './types';

const Header = styled.div`
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const getTypeFromTypeId = (
  typeRecordingId: string,
  types: OperationRecordingPlans[number]['typeRecordingPlans']
) => {
  const typeRecording = types[typeRecordingId];
  if (typeRecording === undefined) {
    throw new Error(
      `The given typeRecordingId:${typeRecordingId} does not have a provided reference.`
    );
  }

  return typeRecording;
};

type GetValue = (params: {
  level: number;
  typeRecordings: OperationRecordingPlans[number]['typeRecordingPlans'];
  valueConfig: TypeRecordingValue;
}) => JSX.Element;
const getValue: GetValue = ({ level, typeRecordings, valueConfig }) => {
  if (valueConfig.type === 'value') {
    return <>{`${valueConfig.value}`}</>;
  }

  if (Array.isArray(valueConfig.value)) {
    return <>TODO implement array case</>;
  }

  const type = getTypeFromTypeId(valueConfig.value.recordingId, typeRecordings);

  return (
    <Field
      level={level + 1}
      typeRecordings={typeRecordings}
      value={type.value}
    />
  );
};

const StyledField = styled.div<{ level: number }>`
  font-size: 15px;
  margin-left: ${(props) => props.level * 10}px;
`;

type FieldProps = {
  typeRecordings: OperationRecordingPlans[number]['typeRecordingPlans'];
  value: TypeRecordingPlan['value'];
  level?: number;
};

const Field: React.FC<FieldProps> = ({ level = 0, typeRecordings, value }) => (
  <>
    {Object.entries(value).map(([fieldName, valueConfig]) => (
      <StyledField level={level}>
        {fieldName}: {getValue({ level, valueConfig, typeRecordings })}
      </StyledField>
    ))}
  </>
);

export type RecordingProps = {
  rootTypeRecordingIds: OperationRecordingPlans[number]['rootTypeRecordingIds'];
  typeRecordings: OperationRecordingPlans[number]['typeRecordingPlans'];
};

export const Recording: React.FC<RecordingProps> = ({
  rootTypeRecordingIds,
  typeRecordings,
}) => {
  const rootTypes = rootTypeRecordingIds.map((rootTypeRecordingId) =>
    getTypeFromTypeId(rootTypeRecordingId, typeRecordings)
  );

  return (
    <div>
      {rootTypes.map(({ typeName, value }) => (
        <>
          <Header>{typeName}</Header>
          <Field typeRecordings={typeRecordings} value={value} />
        </>
      ))}
    </div>
  );
};
