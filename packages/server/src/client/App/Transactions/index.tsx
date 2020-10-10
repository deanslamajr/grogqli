import React, { useEffect, useState} from 'react';
import { useQuery, useSubscription, ApolloError } from '@apollo/client';
import {GetRecordings, OnRecordingSaved, Recording} from '@grogqli/schema';

import './index.css';

const TransactionsWithData: React.FC = () => {
  const {data, loading, error, subscribeToMore} = useQuery(
    GetRecordings.GetRecordingsDocument,
    // { variables: {  } }
  );

  if (error) {
    console.error(error);
  }

  return <Transactions
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
            const newSet: Recording[] = JSON.parse(JSON.stringify(prev.recordings));
            
            const recordedRequest = newSet.find(recording => recording.id === newFeedItem.id);

            if (recordedRequest) {
              Object.assign(recordedRequest, newFeedItem);
              return newSet;
            } else {
              return [newFeedItem, ...newSet];
            }
          }

          return Object.assign({}, prev, {
            recordings: prev.recordings !== null
              ? combineAndDedupe()
              : [newFeedItem]
            }
          );
        }
      })
    }}
  />;
};

interface TransactionsProps {
  recordings: GetRecordings.Recording[];
  loading: boolean;
  error?: ApolloError;
  subscribeToRecordings: () => void;
}

const Transactions: React.FC<TransactionsProps> = (
  {recordings, subscribeToRecordings}
) => {
  React.useEffect(() => {
    subscribeToRecordings();
  }, []);

  return (<div className='Home'>
    <table>
      <thead>
        <tr>
          <th>op name</th>
        </tr>
      </thead>
      <tbody>
        {recordings.map(transaction => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </tbody>
    </table>
  </div>);
}

interface TransactionProps {
  transaction: GetRecordings.Recording;
}

const Transaction: React.FC<TransactionProps> = ({transaction}) => {
  return (
    <tr>
      <td>{transaction.operationName}</td>
    </tr>
  );
}

export default TransactionsWithData;
