import React from 'react';
import styled from 'styled-components';
import { GetRecordings } from '@grogqli/schema';

interface CheckBoxProps {
  isChecked: boolean;
}

export const CheckBox = styled.td<CheckBoxProps>`
  background-color: ${(props) => (props.isChecked ? 'aquamarine' : 'white')};
  width: 3rem;
  height: 3rem;
`;

const StyledCell = styled.td`
  text-align: left;
  padding: 0.5em 1em;
`;

interface TransactionProps {
  isChecked: boolean;
  opName: GetRecordings.Recording['operationName'];
  toggleCheck: () => void;
}

const Transaction: React.FC<TransactionProps> = ({
  isChecked,
  opName,
  toggleCheck,
}) => {
  return (
    <>
      <CheckBox isChecked={isChecked} onClick={toggleCheck} />
      <StyledCell>{opName}</StyledCell>
    </>
  );
};

export default Transaction;