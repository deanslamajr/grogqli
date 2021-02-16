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

const StyledHeader = styled.th<{ width?: string }>`
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  height: ${({ theme }) => theme.sizes.menuBarHeight};
  background-color: ${({ theme }) => theme.colors.highGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  line-height: 1.9;
  font-size: 15px;
  text-align: left;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.selectedMenuItemText};
  padding: 0 15px 0;
  cursor: pointer;
  width: ${({ width }) => width || 'inherit'};
  z-index: ${({ theme }) => theme.zIndex.highest};
`;

const CheckAllHeader = styled(StyledHeader)<{
  isChecked: boolean;
}>`
  padding: 0;
  background-color: ${(props) =>
    props.isChecked ? props.theme.colors.blue : props.theme.colors.white};
  width: ${({ theme }) => theme.sizes.menuBarHeight};
  &:hover {
    background-color: ${(props) =>
      props.isChecked
        ? props.theme.colors.blueClearDark
        : props.theme.colors.blueClear};
    cursor: pointer;
  }
`;

const StyledRow = styled.tr<{ isOdd: boolean }>`
  height: ${({ theme }) => theme.sizes.menuBarHeight};
  background-color: ${({ isOdd, theme }) =>
    isOdd ? theme.colors.highGray : theme.colors.generalBackgroundColor};

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
  subscribeToRecordings: () => () => void;
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
    const unsubscribe = subscribeToRecordings();
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showSaveDrawer, setShowSaveDrawer] = useState(false);

  return (
    <TransactionsContainer>
      <StyledTable>
        <thead>
          <tr>
            <CheckAllHeader
              isChecked={allAreChecked}
              onClick={toggleAllChecked}
            />
            <StyledHeader width={'20%;'}>operation</StyledHeader>
            <StyledHeader width={'24%;'}>variables</StyledHeader>
            <StyledHeader width={'30%;'}>data</StyledHeader>
            <StyledHeader width={'25%;'}>errors</StyledHeader>
          </tr>
        </thead>
        <tbody>
          {temporaryOperationRecordings.map((tempOpRecording, index) => (
            <StyledRow key={tempOpRecording.id} isOdd={index % 2 === 1}>
              <Transaction
                tempOpRecording={tempOpRecording}
                isChecked={checkedState[tempOpRecording.id]}
                toggleCheck={() => toggleCheck(tempOpRecording.id)}
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
