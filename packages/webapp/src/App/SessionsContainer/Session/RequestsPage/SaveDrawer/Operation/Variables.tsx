import React from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';
import { Select } from '../../../../../../components/Select';

const SKIP = 'SKIP';
const EXACT = 'EXACT';

const Container = styled.pre`
  padding: 0.15rem 0.25rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const Header = styled.div`
  font-size: 1.15rem;
  padding: 0.25rem;
`;

const defaultReactJsonProps: ReactJsonViewProps = {
  name: false,
  indentWidth: 2,
  enableClipboard: false,
  displayDataTypes: false,
  displayObjectSize: false,
  sortKeys: true,
  collapsed: false,
  // @ts-ignore
  quotesOnKeys: false,
};

const generateInitialValues = (variables: object) => {
  const initialValues: { [argName: string]: 'SKIP' } = {};

  Object.entries(variables).forEach(([key, value]) => {
    initialValues[key] = 'SKIP';
  });

  return initialValues;
};

type VariableDropDownProps = {
  name: string;
  value: typeof SKIP | typeof EXACT;
};

const VariableDropDown: React.FC<VariableDropDownProps> = ({ name, value }) => {
  return (
    <>
      <label htmlFor={name}>{name}</label>
      <Select name={name} id={name}>
        <option key={SKIP} value={SKIP}>
          {SKIP}
        </option>
        <option key={EXACT} value={EXACT}>
          {EXACT}
        </option>
      </Select>
    </>
  );
};

export type VariablesProps = {
  onUpdate: (payload: object) => void;
  variablesString?: string;
};

export const Variables: React.FC<VariablesProps> = ({
  onUpdate,
  variablesString,
}) => {
  const [variables, setVariables] = React.useState<object | null>(null);
  React.useEffect(() => {
    if (variablesString !== undefined) {
      const parsedVariables = JSON.parse(variablesString);
      setVariables(parsedVariables);
    }
  }, []);

  return (
    variables && (
      <Container>
        <Header>Variables</Header>
        <br />
        <ReactJson {...defaultReactJsonProps} src={variables} />
        <Form
          onSubmit={(values) => onUpdate(values)}
          initialValues={generateInitialValues(variables)}
          render={({ form, values }) => (
            <form>
              {Object.entries(values).map(([argName, value]) => (
                <VariableDropDown name={argName} value={value} />
              ))}
            </form>
          )}
        />
      </Container>
    )
  );
};
