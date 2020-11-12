import React, { FC } from 'react';
import styled from 'styled-components';
import { format } from 'graphql-formatter';
import { GetRecordings } from '@grogqli/schema';
import useKey from '@rooks/use-key';

import { SaveRecordingsButton } from './SaveRecordingsButton';

interface SaveDrawerProps {
  handleClose: () => void;
  recordingsToSave: GetRecordings.Recording[];
  show: boolean;
}

const OperationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
  margin-bottom: 5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.whiteDark};
`;

const OperationName = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const Code = styled.pre`
  padding: 0.15rem 0.25rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const SaveDrawerContainer = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  height: ${(props) => (props.show ? '100%' : 0)};
  top: ${(props) => (props.show ? 0 : '100%')};
  overflow: ${(props) => (props.show ? 'auto' : 'hidden')};
  background-color: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.black};
  transition: all 0.25s;
`;

export const SaveDrawer: FC<SaveDrawerProps> = ({
  handleClose,
  recordingsToSave,
  show,
}) => {
  useKey(['Escape'], handleClose);

  return (
    <SaveDrawerContainer show={show}>
      {recordingsToSave.map((recording) => (
        <OperationContainer key={recording.id}>
          <OperationName>{recording.operationName}</OperationName>
          <Code>{format(recording.query)}</Code>
          <Code>
            {JSON.stringify(JSON.parse(recording?.response || ''), null, 2)}
          </Code>
        </OperationContainer>
      ))}
      {show ? (
        <SaveRecordingsButton onClick={() => console.log('Saving...')} />
      ) : null}
    </SaveDrawerContainer>
  );
};
