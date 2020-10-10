/* 3444e03c67fdcde3fbe274b43e4f9c9a819bdbcc
 * This file is automatically generated by graphql-let. */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Recording = {
  __typename?: 'Recording';
  replaceThisBullshxt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getRecordings: Array<Maybe<Recording>>;
};

export type GetRecordingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecordingsQuery = (
  { __typename?: 'Query' }
  & { getRecordings: Array<Maybe<(
    { __typename?: 'Recording' }
    & Pick<Recording, 'replaceThisBullshxt'>
  )>> }
);


export const GetRecordingsDocument = gql`
    query GetRecordings {
  getRecordings {
    replaceThisBullshxt
  }
}
    `;

/**
 * __useGetRecordingsQuery__
 *
 * To run a query within a React component, call `useGetRecordingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecordingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecordingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecordingsQuery(baseOptions?: Apollo.QueryHookOptions<GetRecordingsQuery, GetRecordingsQueryVariables>) {
        return Apollo.useQuery<GetRecordingsQuery, GetRecordingsQueryVariables>(GetRecordingsDocument, baseOptions);
      }
export function useGetRecordingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecordingsQuery, GetRecordingsQueryVariables>) {
          return Apollo.useLazyQuery<GetRecordingsQuery, GetRecordingsQueryVariables>(GetRecordingsDocument, baseOptions);
        }
export type GetRecordingsQueryHookResult = ReturnType<typeof useGetRecordingsQuery>;
export type GetRecordingsLazyQueryHookResult = ReturnType<typeof useGetRecordingsLazyQuery>;
export type GetRecordingsQueryResult = Apollo.QueryResult<GetRecordingsQuery, GetRecordingsQueryVariables>;