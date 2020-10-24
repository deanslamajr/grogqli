import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ApolloError } from '@apollo/client';
import { GetRecordings } from '@grogqli/schema';

import { CheckedState } from './';
import Transaction from './Transaction';

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
  background-color: #555;
  color: #fff;
  text-align: left;
  padding: 0.5em 1em;
`;

const CheckAllHeader = styled(StyledHeader)<{
  isChecked: boolean;
}>`
  padding: 0;
  background-color: ${(props) => (props.isChecked ? 'aquamarine' : 'white')};
  width: 3rem;
  height: 3rem;
`;

const StyledRow = styled.tr`
  &:nth-child(odd) {
    background-color: #eee;
  }
  &:nth-child(even) {
    background-color: white;
  }
  &:hover {
    background-color: aquamarine;
    cursor: pointer;
  }
`;

// const CheckAll = styled(CheckBox)`
//   width: inherit;
// `;

interface TransactionsProps {
  allAreChecked: boolean;
  checkedState: CheckedState;
  recordings: GetRecordings.Recording[];
  loading: boolean;
  error?: ApolloError;
  subscribeToRecordings: () => void;
  toggleCheck: (id: string) => void;
  toggleAllChecked: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({
  allAreChecked,
  checkedState,
  recordings,
  subscribeToRecordings,
  toggleAllChecked,
  toggleCheck,
}) => {
  useEffect(() => {
    subscribeToRecordings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          {recordings.map(({ id, operationName }) => (
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
    </TransactionsContainer>
  );
};

export default Transactions;
