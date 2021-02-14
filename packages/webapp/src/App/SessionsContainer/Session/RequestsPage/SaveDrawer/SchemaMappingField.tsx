import React from 'react';
import { Field } from 'react-final-form';
import styled from 'styled-components';
import { SchemaRecording } from '@grogqli/schema';

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
  schemaName?: string;
}

interface Props {
  isGettingSchemas: boolean;
  schemas?: SchemaRecording[];
}

export const SchemaMappingField: React.FC<Props> = ({
  isGettingSchemas,
  schemas,
}) => {
  return (
    <Field<SchemasMapping[]> name="schemasMappings">
      {({ input, meta }) => (
        <FormFieldContainer>
          <>
            <label>Schema Mappings</label>
            {input?.value
              ? input.value.map(
                  (
                    {
                      opsRecordingsSchemaUrl,
                      opsRecordingsSchemaHash,
                      targetSchemaId,
                      schemaName,
                    },
                    index
                  ) => (
                    <div key={opsRecordingsSchemaHash}>
                      <span>{opsRecordingsSchemaUrl}</span>
                      <div>
                        <SchemasDropdown
                          disabled={isGettingSchemas}
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
                                opsRecordingsSchemaUrl,
                                opsRecordingsSchemaHash,
                                schemaName,
                                targetSchemaId: newValue,
                              },
                            ]);
                          }}
                        >
                          {isGettingSchemas ? (
                            <option key="loading" value={targetSchemaId}>
                              Loading
                            </option>
                          ) : (
                            <>
                              <option key={NEW_SCHEMA_ID} value={NEW_SCHEMA_ID}>
                                Create New Schema
                              </option>
                              {Array.isArray(schemas)
                                ? schemas.map(({ id, name, hash }) => (
                                    <option key={hash} value={id}>
                                      {opsRecordingsSchemaHash === hash
                                        ? `${name} (schema match)`
                                        : name}
                                    </option>
                                  ))
                                : null}
                            </>
                          )}
                        </SchemasDropdown>
                      </div>
                      {targetSchemaId === NEW_SCHEMA_ID ? (
                        <Field name={`schemasMappings[${index}].schemaName`}>
                          {({
                            input: newSchemaNameInput,
                            meta: newSchemaNameInputMeta,
                          }) => {
                            console.log(
                              'newSchemaNameInputMeta',
                              newSchemaNameInputMeta
                            );
                            return (
                              <>
                                <div>
                                  <input
                                    {...newSchemaNameInput}
                                    type="text"
                                    placeholder="schema name"
                                  />
                                </div>
                                <div>
                                  <InvalidFieldMessage>
                                    {newSchemaNameInputMeta.error &&
                                    newSchemaNameInputMeta.touched
                                      ? newSchemaNameInputMeta.error
                                      : ''}
                                  </InvalidFieldMessage>
                                </div>
                              </>
                            );
                          }}
                        </Field>
                      ) : null}
                    </div>
                  )
                )
              : null}
          </>
        </FormFieldContainer>
      )}
    </Field>
  );
};
