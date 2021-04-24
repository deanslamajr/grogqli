import React from 'react';
import styled, { css } from 'styled-components';

const OpContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
  margin-bottom: 5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.whiteDark};
`;

const OpType = styled.div`
  font-size: 0.9rem;
`;

const OpName = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

type OpRecordingPlan = {
  opName: string;
  schemaId: string;
  rootTypeRecordingId: string;
  typeRecordings: Array<{
    typeName: string;
    typeRecordingId: string;
    refs: Array<{
      fieldName: string;
      typeRecordingIds: string[];
    }>;
    values: Array<{
      fieldName: string;
      value: any;
    }>;
  }>;
};

const FieldName = styled.span`
  font-size: 0.8rem;
`;

const fieldValueStyles = css`
  font-size: 0.75rem;
  font-weight: 600;
`;

const FieldValue = styled.span`
  ${fieldValueStyles}
`;

const Indent = styled.div<{ level: number }>`
  margin-left: ${(props) => props.level * 10}px;
`;

const RootTypeError = styled.div`
  color: ${(props) => props.theme.colors.red};
`;

const NestedTypeError = styled(RootTypeError)`
  ${fieldValueStyles}
`;

const PaginationButton = styled.span`
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;

  &:hover {
    font-size: 1rem;
  }
`;

const PaginationData = styled.span`
  font-size: 0.9rem;
  cursor: default;
`;

type ListPagination = {
  currentPage: number;
  totalPages: number;
};

type PaginationProps = {
  pagination: ListPagination;
  onPageChange: (newPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  pagination,
}) => {
  return pagination.totalPages > 1 ? (
    <div>
      <PaginationButton
        onClick={() => onPageChange(pagination.currentPage - 1)}
      >
        {' < '}
      </PaginationButton>
      <PaginationData>{`${pagination.currentPage + 1} of ${
        pagination.totalPages
      }`}</PaginationData>
      <PaginationButton
        onClick={() => onPageChange(pagination.currentPage + 1)}
      >
        {' > '}
      </PaginationButton>
    </div>
  ) : null;
};

type TypeProps = {
  level?: number;
  typeRecordingIds: string[];
  typeRecordings: OpRecordingPlan['typeRecordings'];
};
const Type: React.FC<TypeProps> = ({
  level = 1,
  typeRecordingIds,
  typeRecordings,
}) => {
  const [pagination, setPagination] = React.useState<ListPagination>({
    currentPage: 0,
    totalPages: 1,
  });

  React.useEffect(() => {
    if (typeRecordingIds.length !== pagination.totalPages) {
      setPagination({
        currentPage:
          pagination.currentPage > typeRecordingIds.length - 1
            ? typeRecordingIds.length - 1
            : pagination.currentPage,
        totalPages: typeRecordingIds.length,
      });
    }
  }, [typeRecordingIds.length]);

  const fields = React.useMemo(() => {
    const typeRecording = typeRecordings.find(
      (typeRecording) =>
        typeRecordingIds[pagination.currentPage] ===
        typeRecording.typeRecordingId
    );

    if (!typeRecording) {
      return;
    }

    return [
      ...typeRecording.values.map((value) => ({
        ...value,
        type: 'value' as const,
      })),
      ...typeRecording.refs.map((ref) => ({
        ...ref,
        type: 'ref' as const,
      })),
    ];
  }, [pagination.currentPage]);

  const onPageChange = (newPage: number) => {
    let validatedNewPage = newPage;

    if (validatedNewPage < 0) {
      validatedNewPage = pagination.totalPages - 1;
    }
    if (validatedNewPage > pagination.totalPages - 1) {
      validatedNewPage = 0;
    }
    setPagination({
      currentPage: validatedNewPage,
      totalPages: pagination.totalPages,
    });
  };

  return (
    <>
      {Array.isArray(fields) ? (
        <Indent level={level}>
          <Pagination pagination={pagination} onPageChange={onPageChange} />
          {fields.map((field) => (
            <div key={field.fieldName}>
              <FieldName>{field.fieldName}</FieldName>
              {field.type === 'value' ? (
                <FieldValue>{` = ${JSON.stringify(field.value)}`}</FieldValue>
              ) : (
                <Type
                  level={level + 1}
                  typeRecordingIds={field.typeRecordingIds}
                  typeRecordings={typeRecordings}
                />
              )}
            </div>
          ))}
        </Indent>
      ) : (
        <NestedTypeError as="span">{`No typeRecording found for the given typeRecordingId: ${typeRecordingIds}`}</NestedTypeError>
      )}
    </>
  );
};

export type OperationRecordingPlanProps = {
  opName: string;
  rootTypeRecordingId: string;
  typeRecordings: OpRecordingPlan['typeRecordings'];
};
export const OperationRecordingPlan: React.FC<OperationRecordingPlanProps> = ({
  opName,
  rootTypeRecordingId,
  typeRecordings,
}) => {
  const rootTypeData = React.useMemo(() => {
    const rootTypeRecording = typeRecordings.find(
      (typeRecording) => rootTypeRecordingId === typeRecording.typeRecordingId
    );

    return {
      typeRecording: rootTypeRecording,
      typeRecordingIds: [rootTypeRecordingId],
    };
  }, []);

  return (
    <OpContainer>
      {rootTypeData.typeRecording ? (
        <>
          <OpName>{opName}</OpName>
          <OpType>{rootTypeData.typeRecording.typeName}</OpType>
          <Type
            typeRecordingIds={rootTypeData.typeRecordingIds}
            typeRecordings={typeRecordings}
          />
        </>
      ) : (
        <RootTypeError>{`rootTypeRecording not found for given rootTypeRecordingId: ${rootTypeRecordingId}`}</RootTypeError>
      )}
    </OpContainer>
  );
};
