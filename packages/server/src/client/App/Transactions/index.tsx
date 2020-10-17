import React from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { GetRecordings, OnRecordingSaved, Recording } from '@grogqli/schema';
import styled from 'styled-components';

const TransactionsWithData: React.FC = () => {
  const { data, loading, error, subscribeToMore } = useQuery(
    GetRecordings.GetRecordingsDocument
    // { variables: {  } }
  );

  if (error) {
    console.error(error);
  }

  return (
    <Transactions
      recordings={data?.recordings || []}
      loading={loading}
      error={error}
      subscribeToRecordings={() => {
        return subscribeToMore({
          document: OnRecordingSaved.OnRecordingSaveDocument,
          // variables: {  },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newFeedItem = subscriptionData.data.recordingSaved;

            if (newFeedItem === null) {
              return prev;
            }

            const combineAndDedupe = () => {
              // deep copy
              const newSet: Recording[] = JSON.parse(
                JSON.stringify(prev.recordings)
              );

              const recordedRequest = newSet.find(
                (recording) => recording.id === newFeedItem.id
              );

              if (recordedRequest) {
                Object.assign(recordedRequest, newFeedItem);
                return newSet;
              } else {
                return [...newSet, newFeedItem];
              }
            };

            return Object.assign({}, prev, {
              recordings:
                prev.recordings !== null ? combineAndDedupe() : [newFeedItem],
            });
          },
        });
      }}
    />
  );
};

interface TransactionsProps {
  recordings: GetRecordings.Recording[];
  loading: boolean;
  error?: ApolloError;
  subscribeToRecordings: () => void;
}

const TransactionsContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
`;

const StyledRow = styled.tr`
  &:nth-child(odd) {
    background-color: #eee;
  }

  &:hover {
    background-color: aquamarine;
    cursor: pointer;
  }
`;

const StyledHeader = styled.th`
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  background-color: #555;
  color: #fff;
  text-align: left;
  padding: 0.5em 1em;
`;

const StyledCell = styled.td`
  text-align: left;
  padding: 0.5em 1em;
`;

const Transactions: React.FC<TransactionsProps> = ({
  recordings,
  subscribeToRecordings,
}) => {
  React.useEffect(() => {
    subscribeToRecordings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TransactionsContainer>
      <StyledTable>
        <thead>
          <StyledRow>
            <StyledHeader>op name</StyledHeader>
          </StyledRow>
        </thead>
        <tbody>
          {recordings.map((transaction) => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </tbody>
      </StyledTable>
    </TransactionsContainer>
  );
};

interface TransactionProps {
  transaction: GetRecordings.Recording;
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  return (
    <StyledRow>
      <StyledCell>{transaction.operationName}</StyledCell>
    </StyledRow>
  );
};

export default TransactionsWithData;
