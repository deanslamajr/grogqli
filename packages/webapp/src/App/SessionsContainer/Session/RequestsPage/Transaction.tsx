import React from 'react';
import styled from 'styled-components';
import { GetTempOpRecordings } from '@grogqli/schema';

interface CheckBoxProps {
  isChecked: boolean;
}

export const CheckBox = styled.td<CheckBoxProps>`
  background-color: ${(props) =>
    props.isChecked ? props.theme.colors.blue : props.theme.colors.white};
  width: ${({ theme }) => theme.sizes.menuBarHeight};
  height: ${({ theme }) => theme.sizes.menuBarHeight};

  &:hover {
    background-color: ${(props) =>
      props.isChecked
        ? props.theme.colors.blueClearDark
        : props.theme.colors.blueClear};
    cursor: pointer;
  }
`;

const StyledCell = styled.td`
  text-align: left;
  line-height: 1.9;
  font-size: 14px;
  text-align: left;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.selectedMenuItemText};
  padding: 0 15px 0;
  cursor: pointer;
`;

interface TransactionProps {
  isChecked: boolean;
  opName: GetTempOpRecordings.TemporaryOperationRecording['operationName'];
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
