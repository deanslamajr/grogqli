import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApolloError } from '@apollo/client';
import { GetTempOpRecordings } from '@grogqli/schema';

import { CheckedState } from '.';
import Transaction from './Transaction';
import { ReviewRecordingsBeforeSaveButton } from './ReviewRecordingsBeforeSaveButton';
import { SaveDrawer } from './SaveDrawer';

const TransactionsContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
`;

const StyledHeader = styled.th`
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  background-color: ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.white};
  text-align: left;
  padding: 0.5em 1em;
`;

const CheckAllHeader = styled(StyledHeader)<{
  isChecked: boolean;
}>`
  padding: 0;
  background-color: ${(props) =>
    props.isChecked ? props.theme.colors.blue : props.theme.colors.white};
  width: 3rem;
  height: 3rem;
  &:hover {
    background-color: ${(props) =>
      props.isChecked
        ? props.theme.colors.blueClearDark
        : props.theme.colors.blueClear};
    cursor: pointer;
  }
`;

const StyledRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${(props) => props.theme.colors.grayDark};
  }
  &:nth-child(even) {
    background-color: ${(props) => props.theme.colors.grayLight};
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.blueClear};
    cursor: pointer;
  }
`;

interface TransactionsProps {
  allAreChecked: boolean;
  checkedState: CheckedState;
  temporaryOperationRecordings: GetTempOpRecordings.TemporaryOperationRecording[];
  loading: boolean;
  error?: ApolloError;
  subscribeToRecordings: () => void;
  toggleCheck: (id: string) => void;
  toggleAllChecked: () => void;
}

const areAnyTransactionsChecked = (checkedState: CheckedState): boolean => {
  return Object.values(checkedState).some(Boolean);
};

const Transactions: React.FC<TransactionsProps> = ({
  allAreChecked,
  checkedState,
  temporaryOperationRecordings,
  subscribeToRecordings,
  toggleAllChecked,
  toggleCheck,
}) => {
  useEffect(() => {
    subscribeToRecordings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showSaveDrawer, setShowSaveDrawer] = useState(false);

  return (
    <TransactionsContainer>
      <StyledTable>
        <thead>
          <StyledRow>
            <CheckAllHeader
              isChecked={allAreChecked}
              onClick={toggleAllChecked}
            />
            <StyledHeader>op name</StyledHeader>
          </StyledRow>
        </thead>
        <tbody>
          {temporaryOperationRecordings.map(({ id, operationName }) => (
            <StyledRow key={id}>
              <Transaction
                opName={operationName}
                isChecked={checkedState[id]}
                toggleCheck={() => toggleCheck(id)}
              />
            </StyledRow>
          ))}
        </tbody>
      </StyledTable>
      {areAnyTransactionsChecked(checkedState) ? (
        <ReviewRecordingsBeforeSaveButton
          onClick={() => setShowSaveDrawer(!showSaveDrawer)}
          showSaveIcon={!showSaveDrawer}
        />
      ) : null}
      <SaveDrawer
        handleClose={() => setShowSaveDrawer(false)}
        show={showSaveDrawer}
        tempOpRecordingsToSave={temporaryOperationRecordings.filter(
          (recording) => checkedState[recording.id]
        )}
      />
    </TransactionsContainer>
  );
};

export default Transactions;
