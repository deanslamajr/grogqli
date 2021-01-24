import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GetRecordings, OnRecordingSaved, Recording } from '@grogqli/schema';

import Transactions from './Transactions';

export type CheckedState = { [id: string]: boolean };

export const RequestsPage: React.FC = () => {
  const [checkedState, updateCheckedState] = useState<CheckedState>({});
  const [allAreChecked, setAllAreChecked] = useState(false);
  const { data, loading, error, subscribeToMore } = useQuery(
    GetRecordings.GetRecordingsDocument
  );

  if (error) {
    console.error(error);
  }

  const toggleCheck = useCallback(
    (id: string) => {
      const newCheckedState = { ...checkedState };
      newCheckedState[id] = !Boolean(newCheckedState[id]);
      updateCheckedState(newCheckedState);

      const everyRecordingIsChecked = data?.recordings?.every(({ id }) => {
        return newCheckedState[id];
      });

      if (everyRecordingIsChecked) {
        setAllAreChecked(true);
      } else {
        if (allAreChecked) {
          setAllAreChecked(false);
        }
      }
    },
    [checkedState, allAreChecked, data?.recordings]
  );

  const toggleAllChecked = useCallback(() => {
    if (allAreChecked) {
      updateCheckedState({});
      setAllAreChecked(false);
    } else {
      const newCheckedState: CheckedState = {};
      data?.recordings?.forEach(({ id }) => {
        newCheckedState[id] = true;
      });
      updateCheckedState(newCheckedState);
      setAllAreChecked(true);
    }
  }, [allAreChecked, data?.recordings]);

  return (
    <Transactions
      allAreChecked={allAreChecked}
      checkedState={checkedState}
      toggleCheck={toggleCheck}
      recordings={data?.recordings || []}
      loading={loading}
      error={error}
      toggleAllChecked={toggleAllChecked}
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
