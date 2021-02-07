import React from 'react';
import { Field } from 'react-final-form';
import { CreateWorkflowInput } from '@grogqli/schema';
import styled from 'styled-components';

import { FormFieldContainer, InvalidFieldMessage } from './common';

export const NEW_SCHEMA_ID = 'NEW';

const SchemasDropdown = styled.select`
  // A reset of styles, including removing the default dropdown arrow
  appearance: none;
  color: ${({ theme }) => theme.colors.selectedMenuItemText};
  background-color: ${({ theme }) => theme.colors.generalBackgroundColor};
  border: none;
  margin: 0 5px;
  padding: 0 5px;
  width: 300px;
  height: calc(${({ theme }) => theme.sizes.menuBarHeight} - 5px);
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;

  &:focus {
    outline: none;
  }
`;

export interface SchemasMapping {
  opsRecordingsSchemaUrl: string;
  opsRecordingsSchemaHash: string;
  targetSchemaId: string;
}

export const SchemaMappingField: React.FC<{}> = () => {
  return (
    <Field<SchemasMapping[]> name="schemasMappings">
      {({ input, meta }) => (
        <FormFieldContainer>
          <>
            <label>Schema Mappings</label>
            {input?.value
              ? input.value.map(
                  ({ opsRecordingsSchemaUrl, targetSchemaId }) => (
                    <div>
                      <span>{opsRecordingsSchemaUrl}</span>
                      <SchemasDropdown
                        value={targetSchemaId}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const listWithoutThisItem = input.value.filter(
                            ({ targetSchemaId: thisTargetSchemaId }) =>
                              targetSchemaId !== thisTargetSchemaId
                          );
                          input.onChange([
                            ...listWithoutThisItem,
                            {
                              url: targetSchemaId,
                              id: newValue,
                            },
                          ]);
                        }}
                      >
                        <option value={NEW_SCHEMA_ID}>Create New Schema</option>
                      </SchemasDropdown>
                    </div>
                  )
                )
              : null}
            <InvalidFieldMessage>
              {meta.error && meta.touched ? meta.error : ''}
            </InvalidFieldMessage>
          </>
        </FormFieldContainer>
      )}
    </Field>
  );
};
