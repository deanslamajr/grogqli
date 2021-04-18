import React from 'react';
import styled from 'styled-components';
import { GetTempOpRecordings } from '@grogqli/schema';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

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

const SchemaUrlStyled = styled.div`
  font-size: 11px;
  opacity: 0.8;
`;

const OpNameStyled = styled.div`
  font-size: 15px;
`;

const RowStyled = styled.div`
  max-height: 150px;
  overflow-y: overlay;
`;

const defaultReactJsonProps: ReactJsonViewProps = {
  name: false,
  indentWidth: 1,
  enableClipboard: true,
  displayDataTypes: false,
  displayObjectSize: false,
  sortKeys: true,
  collapsed: 1,
  style: { fontSize: '10px' },
  // @ts-ignore
  quotesOnKeys: false,
};

interface TransactionProps {
  tempOpRecording: GetTempOpRecordings.TemporaryOperationRecording;
  isChecked: boolean;
  // opName: GetTempOpRecordings.TemporaryOperationRecording['operationName'];
  toggleCheck: () => void;
}

const Transaction: React.FC<TransactionProps> = ({
  isChecked,
  tempOpRecording: { operationName, response, schemaUrl, variables },
  toggleCheck,
}) => {
  return (
    <>
      <CheckBox isChecked={isChecked} onClick={toggleCheck} />
      <StyledCell>
        <SchemaUrlStyled>{schemaUrl}</SchemaUrlStyled>
        <OpNameStyled>{operationName}</OpNameStyled>
      </StyledCell>
      <StyledCell>
        <RowStyled>
          <ReactJson {...defaultReactJsonProps} src={variables} collapsed={2} />
        </RowStyled>
      </StyledCell>
      <StyledCell>
        <RowStyled>
          {response !== null ? (
            response.data ? (
              <ReactJson {...defaultReactJsonProps} src={response.data} />
            ) : (
              'null'
            )
          ) : null}
        </RowStyled>
      </StyledCell>
      <StyledCell>
        <RowStyled>
          {response !== null ? (
            response.errors ? (
              <ReactJson {...defaultReactJsonProps} src={response.errors} />
            ) : (
              'null'
            )
          ) : null}
        </RowStyled>
      </StyledCell>
    </>
  );
};

export default Transaction;
