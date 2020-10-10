import React, { useEffect, useState} from 'react';
import { useQuery, useSubscription, ApolloError } from '@apollo/client';
import {GetRecordings, OnRecordingSaved} from '@grogqli/schema';

import './index.css';

const TransactionsWithData: React.FC = () => {
  const {data, loading, error} = useQuery(
    GetRecordings.GetRecordingsDocument,
    // { variables: { postID: params.postID } }
  );
  console.log('data', data)
  if (error) {
    console.error(error);
  }
  return <Transactions
    recordings={data?.recordings || []}
    loading={loading}
    error={error}
  />;
};

interface TransactionsProps {
  recordings: GetRecordings.Recording[];
  loading: boolean;
  error?: ApolloError;
}

const Transactions: React.FC<TransactionsProps> = ({recordings, loading, error}) => {
  return (<div className='Home'>
    <table>
    <tr>
      <th>op name</th>
    </tr>
      {recordings.map(transaction => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </table>
  </div>);
}

interface TransactionProps {
  transaction: GetRecordings.Recording;
}

const Transaction: React.FC<TransactionProps> = ({transaction}) => {
  return (<tr>
    <td>{transaction.operationName}</td>
  </tr>)
}

export default TransactionsWithData;
