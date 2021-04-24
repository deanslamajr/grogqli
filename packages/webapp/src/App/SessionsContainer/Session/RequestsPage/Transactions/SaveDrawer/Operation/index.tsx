import React from 'react';
import styled from 'styled-components';
import { format } from 'graphql-formatter';
// import { Response } from './Response';
import { Recording } from './Recording';
import { OperationRecordingPlans } from './types';

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
  plan: OperationRecordingPlans[number];
};

export const Operation: React.FC<OperationProps> = ({ plan, children }) => {
  const [showQuery, setShowQuery] = React.useState(false);

  return (
    <OperationContainer key={plan.id}>
      <OperationName onClick={() => setShowQuery(!showQuery)}>
        {plan.opName}
      </OperationName>
      {showQuery && <Query>{format(plan.sdl)}</Query>}
      {children}
      {/* <Response responseString={response} /> */}
      <Recording
        rootTypeRecordingIds={plan.rootTypeRecordingIds}
        typeRecordings={plan.typeRecordingPlans}
      />
    </OperationContainer>
  );
};
