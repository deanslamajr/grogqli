import React from 'react';
import { Field } from 'react-final-form';
import { SchemaRecording } from '@grogqli/schema';
import { Select } from '../../../../../components/Select';
import { FormFieldContainer, InvalidFieldMessage } from './common';

export const NEW_SCHEMA_ID = 'NEW';

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
                        <Select
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
                        </Select>
                      </div>
                      {targetSchemaId === NEW_SCHEMA_ID ? (
                        <Field name={`schemasMappings[${index}].schemaName`}>
                          {({
                            input: newSchemaNameInput,
                            meta: newSchemaNameInputMeta,
                          }) => {
                            return (
                              <>
                                <div key="1">
                                  <input
                                    {...newSchemaNameInput}
                                    type="text"
                                    placeholder="schema name"
                                  />
                                </div>
                                <div key="2">
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
