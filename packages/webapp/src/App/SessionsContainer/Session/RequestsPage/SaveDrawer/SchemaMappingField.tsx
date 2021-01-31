import React from 'react';
import { Field } from 'react-final-form';
import { CreateWorkflowInput } from '@grogqli/schema';

import { FormFieldContainer, InvalidFieldMessage } from './';

export const SchemaMappingField: React.FC<{}> = () => {
  return (
    <Field<CreateWorkflowInput['schemasMapping']> name="schemasMapping">
      {({ input, meta }) => (
        <FormFieldContainer>
          <>
            <label>Schema Mappings</label>
            {input.value.map(({ id, url }) => (
              <div>
                <span>{url}</span>
                <input
                  value={id}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const listWithoutThisItem = input.value.filter(
                      ({ url: thisUrl }) => url !== thisUrl
                    );
                    input.onChange([
                      ...listWithoutThisItem,
                      {
                        url,
                        id: newValue,
                      },
                    ]);
                  }}
                  type="text"
                />
              </div>
            ))}
            <InvalidFieldMessage>
              {meta.error && meta.touched ? meta.error : ''}
            </InvalidFieldMessage>
          </>
        </FormFieldContainer>
      )}
    </Field>
  );
};
