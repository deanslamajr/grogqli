import React from 'react';
import styled from 'styled-components';
import { format } from 'graphql-formatter';
import { Variables } from './Variables';
import { Response } from './Response';

const OperationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
  margin-bottom: 5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.whiteDark};
`;

const OperationName = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const Query = styled.pre`
  padding: 0.15rem 0.25rem;
  background-color: ${(props) => props.theme.colors.white};
`;

export type OperationProps = {
  operationName: string;
  query: string;
  recordingId: string;
  response: string;
  variablesString: string;
};

export const Operation: React.FC<OperationProps> = ({
  operationName,
  query,
  recordingId,
  response,
  variablesString,
}) => {
  return (
    <OperationContainer key={recordingId}>
      <OperationName>{operationName}</OperationName>
      <Variables
        onUpdate={(payload) =>
          console.log('variables updated, payload', payload)
        }
        variablesString={variablesString}
      />
      <Query>{format(query)}</Query>
      <Response responseString={response} />
    </OperationContainer>
  );
};
