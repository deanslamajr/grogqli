import React from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';
import styled from 'styled-components';
import { Form } from 'react-final-form';
import { Select } from '../../../../../../components/Select';

type MatchStrategyValue = 'SKIP' | 'EXACT';

type MatchStrategy<T> = T extends { [key: string]: any }
  ? 'SKIP' | { [U in keyof T]: MatchStrategy<T[U]> }
  : MatchStrategyValue;

const Container = styled.pre`
  padding: 0.15rem 0.25rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const Header = styled.div`
  font-size: 1.15rem;
  padding: 0.25rem;
`;

const MatchStrategySelect = styled(Select)`
  width: 70px;
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

const generateInitialValues = <T extends object>(
  variables: T,
  initialValues: MatchStrategy<T> | undefined = {} as MatchStrategy<T>
) => {
  Object.entries(variables).forEach(([fieldName, value]) => {
    const key = fieldName;

    initialValues[key] = {
      value: 'SKIP',
    };

    if (typeof value === 'object' && !Array.isArray(value)) {
      initialValues[key].children = {} as MatchStrategy<T>;
      generateInitialValues(value, initialValues[key].children);
    }
  });

  return initialValues;
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.span`
  display: flex;
  flex-direction: column;
`;

const SelectColumn = styled(Column)`
  width: 150px;
`;

type VariableDropDownValues = {
  value: MatchStrategyValue;
  children: VariableDropDownProps | undefined;
};

type VariableDropDownProps = {
  values: MatchStrategy<object>;
};

const VariableDropDown: React.FC<VariableDropDownProps> = ({ values }) => {
  return (
    <>
      {Object.entries(values).map(([name, value]) => (
        <Row key={name}>
          <>
            <SelectColumn>
              <label htmlFor={name}>{name}</label>
              <MatchStrategySelect name={name} id={name}>
                <option key={'SKIP'} value={'SKIP'}>
                  {'SKIP'}
                </option>
                <option key={'EXACT'} value={'EXACT'}>
                  {'EXACT'}
                </option>
              </MatchStrategySelect>
            </SelectColumn>
            {value.children && (
              <Column>
                <VariableDropDown values={value.children} />
              </Column>
            )}
          </>
        </Row>
      ))}
    </>
  );
};

type State<T> = {
  initialValues: MatchStrategy<T>;
  variables: T;
};

export type VariablesProps = {
  onUpdate: (payload: object) => void;
  variablesString?: string;
};

export const Variables: React.FC<VariablesProps> = ({
  onUpdate,
  variablesString,
}) => {
  const [state, setState] = React.useState<State<object> | null>(null);
  React.useEffect(() => {
    if (variablesString !== undefined) {
      const parsedVariables: object = JSON.parse(variablesString);
      const generatedInitialValues = generateInitialValues(parsedVariables);
      setState({
        initialValues: generatedInitialValues,
        variables: parsedVariables,
      });
    }
  }, []);

  return (
    state && (
      <Container>
        <Header>Variables</Header>
        <br />
        <ReactJson {...defaultReactJsonProps} src={state.variables} />
        <Form
          onSubmit={(values) => onUpdate(values)}
          initialValues={state.initialValues}
          render={({ form, values }) => (
            <form>
              <VariableDropDown values={values} />
            </form>
          )}
        />
      </Container>
    )
  );
};
