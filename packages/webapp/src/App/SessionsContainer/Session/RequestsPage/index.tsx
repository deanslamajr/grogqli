import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import {
  GetTempOpRecordings,
  OnTemporaryOperationRecordingSave,
  TemporaryOperationRecording,
} from '@grogqli/schema';

import Transactions from './Transactions';

export type CheckedState = { [id: string]: boolean };

export const RequestsPage: React.FC = () => {
  const [checkedState, updateCheckedState] = useState<CheckedState>({});
  const [allAreChecked, setAllAreChecked] = useState(false);
  const { data, loading, error, subscribeToMore } = useQuery(
    GetTempOpRecordings.GetTempOpRecordingsDocument
  );

  if (error) {
    console.error(error);
  }

  const toggleCheck = useCallback(
    (id: string) => {
      const newCheckedState = { ...checkedState };
      newCheckedState[id] = !Boolean(newCheckedState[id]);
      updateCheckedState(newCheckedState);

      const everyRecordingIsChecked = data?.temporaryOperationRecordings?.every(
        ({ id }) => {
          return newCheckedState[id];
        }
      );

      if (everyRecordingIsChecked) {
        setAllAreChecked(true);
      } else {
        if (allAreChecked) {
          setAllAreChecked(false);
        }
      }
    },
    [checkedState, allAreChecked, data?.temporaryOperationRecordings]
  );

  const toggleAllChecked = useCallback(() => {
    if (allAreChecked) {
      updateCheckedState({});
      setAllAreChecked(false);
    } else {
      const newCheckedState: CheckedState = {};
      data?.temporaryOperationRecordings?.forEach(({ id }) => {
        newCheckedState[id] = true;
      });
      updateCheckedState(newCheckedState);
      setAllAreChecked(true);
    }
  }, [allAreChecked, data?.temporaryOperationRecordings]);

  return (
    <Transactions
      allAreChecked={allAreChecked}
      checkedState={checkedState}
      toggleCheck={toggleCheck}
      temporaryOperationRecordings={data?.temporaryOperationRecordings || []}
      loading={loading}
      error={error}
      toggleAllChecked={toggleAllChecked}
      subscribeToRecordings={() => {
        return subscribeToMore({
          document:
            OnTemporaryOperationRecordingSave.OnTemporaryOperationRecordingSaveDocument,
          // variables: {  },
          updateQuery: (
            prev,
            { subscriptionData: onTemporaryOperationRecordingSaveData }
          ) => {
            if (!onTemporaryOperationRecordingSaveData.data) {
              return prev;
            }

            const newFeedItem =
              onTemporaryOperationRecordingSaveData.data
                .temporaryOperationRecordingSaved;

            if (newFeedItem === null) {
              return prev;
            }

            const combineAndDedupe = () => {
              // deep copy
              const newSet: TemporaryOperationRecording[] = JSON.parse(
                JSON.stringify(prev.temporaryOperationRecordings)
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
                prev.temporaryOperationRecordings !== null
                  ? combineAndDedupe()
                  : [newFeedItem],
            });
          },
        });
      }}
    />
  );
};
