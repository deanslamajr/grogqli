import React, { FC, useMemo } from 'react';
import { Form, Field } from 'react-final-form';
import styled from 'styled-components';
import {
  GetSchemas,
  GetTempOpRecordings,
  CreateWorkflow,
  SchemaRecording,
} from '@grogqli/schema';
import useKey from '@rooks/use-key';
import { useMutation, useQuery } from '@apollo/client';
import { Operation } from './Operation';

import { SaveRecordingsButton } from '../SaveRecordingsButton';

import {
  NEW_SCHEMA_ID,
  SchemaMappingField,
  SchemasMapping,
} from './SchemaMappingField';
import { FormFieldContainer, InvalidFieldMessage } from './common';

const { CreateWorkflowDocument } = CreateWorkflow;

export interface SaveDrawerProps {
  handleClose: () => void;
  tempOpRecordingsToSave: GetTempOpRecordings.TemporaryOperationRecording[];
  show: boolean;
}

const SaveDrawerContainer = styled.div<{ show: boolean }>`
  width: 100%;
  height: ${(props) => (props.show ? '100%' : 0)};
  top: ${(props) => (props.show ? 0 : '100%')};
  overflow: ${(props) => (props.show ? 'auto' : 'hidden')};
  background-color: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.black};
  transition: all 0.25s;
`;

interface CreateWorkflowForm {
  workflowName: string;
  workflowDescription: string;
  schemasMappings: Array<SchemasMapping>;
}

type SchemaMappingValidationErrors = Array<Partial<SchemasMapping>>;
type ValidationErrors = Partial<
  Pick<CreateWorkflowForm, 'workflowName' | 'workflowDescription'>
> & { schemasMappings?: SchemaMappingValidationErrors };

export const SaveDrawer: FC<SaveDrawerProps> = ({
  handleClose,
  tempOpRecordingsToSave,
  show,
}) => {
  useKey(['Escape'], handleClose);
  const [createWorkflow, { loading, error }] = useMutation(
    CreateWorkflowDocument
  );

  const { data: schemasData, loading: isGettingSchemas } = useQuery(
    GetSchemas.GetSchemasDocument,
    {
      fetchPolicy: 'network-only',
      skip: !show,
    }
  );

  const _createWorkflow = async ({
    workflowName,
    workflowDescription,
    schemasMappings,
  }: CreateWorkflowForm) => {
    const operations = tempOpRecordingsToSave.map(({ id, sessionId }) => ({
      sessionId,
      tempRecordingId: id,
    }));

    try {
      await createWorkflow({
        variables: {
          input: {
            operations,
            workflow: {
              name: workflowName,
              description: workflowDescription,
            },
            schemasMappings: schemasMappings.map((schemaMapping) => ({
              ...schemaMapping,
              schemaName: schemaMapping.schemaName || null,
            })),
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  const validateSchemaMappings = (
    schemaMappings: SchemasMapping[],
    errors: ValidationErrors
  ): ValidationErrors => {
    // don't mutate original data
    const copiedErrorData: ValidationErrors = {
      ...errors,
    };
    const schemaMappingsErrors = [] as SchemaMappingValidationErrors;
    schemaMappings.forEach((schemaMapping, index) => {
      if (
        schemaMapping.targetSchemaId === NEW_SCHEMA_ID &&
        (!schemaMapping.schemaName || schemaMapping.schemaName === '')
      ) {
        schemaMappingsErrors[index] = { schemaName: 'Required' };
      }
    });

    copiedErrorData.schemasMappings = schemaMappingsErrors;

    return copiedErrorData;
  };

  const validateForm = (values: CreateWorkflowForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    const requiredError = 'Required';

    if (!values.workflowName) {
      errors.workflowName = requiredError;
    }
    if (!values.workflowDescription) {
      errors.workflowDescription = requiredError;
    }

    return validateSchemaMappings(values.schemasMappings, errors);
  };

  const initialValues = useMemo<CreateWorkflowForm>(() => {
    const schemaUrls = tempOpRecordingsToSave.map(({ schemaUrl }) => schemaUrl);
    const setOfSchemaUrls = new Set(schemaUrls);
    const uniqueSchemaUrls = Array.from(setOfSchemaUrls);

    const schemas = schemasData?.schemas;

    const schemasMappings = uniqueSchemaUrls.map((uniqueSchemaUrl) => {
      const tempOpRecording = tempOpRecordingsToSave.find(
        ({ schemaUrl }) => schemaUrl === uniqueSchemaUrl
      );
      if (!tempOpRecording) {
        throw new Error(`Data corruption: tempOpRecordingsToSave did not have an expected matching schemaUrl:
            tempOpRecordingsToSave: ${JSON.stringify(tempOpRecordingsToSave)}
          `);
      }

      let matchedSchema: SchemaRecording | undefined;
      if (Array.isArray(schemas)) {
        matchedSchema = schemas.find(
          (schema) => tempOpRecording.schemaHash === schema.hash
        );
      }

      return {
        opsRecordingsSchemaUrl: tempOpRecording.schemaUrl,
        opsRecordingsSchemaHash: tempOpRecording.schemaHash,
        targetSchemaId: matchedSchema ? matchedSchema.id : NEW_SCHEMA_ID,
        schemaName: undefined,
      };
    });

    return {
      workflowName: '',
      workflowDescription: '',
      schemasMappings,
    };
  }, [tempOpRecordingsToSave, schemasData]);

  return (
    <SaveDrawerContainer show={show}>
      {loading && <div>Loading...</div>}
      <Form
        onSubmit={(values) => _createWorkflow(values)}
        initialValues={initialValues}
        validate={validateForm}
        render={({ form, valid }) => (
          <form>
            <div>
              <Field name="workflowName">
                {({ input, meta }) => (
                  <FormFieldContainer>
                    <label>Workflow Name</label>
                    <input {...input} type="text" placeholder="name" />
                    <InvalidFieldMessage>
                      {meta.error && meta.touched ? meta.error : ''}
                    </InvalidFieldMessage>
                  </FormFieldContainer>
                )}
              </Field>
              <Field name="workflowDescription">
                {({ input, meta }) => (
                  <FormFieldContainer>
                    <label>Workflow Description</label>
                    <textarea {...input} placeholder="description" />
                    <InvalidFieldMessage>
                      {meta.error && meta.touched ? meta.error : ''}
                    </InvalidFieldMessage>
                  </FormFieldContainer>
                )}
              </Field>

              <SchemaMappingField
                isGettingSchemas={isGettingSchemas}
                schemas={schemasData?.schemas || undefined}
              />

              {tempOpRecordingsToSave.map((recording) => (
                <Operation
                  operationName={recording.operationName}
                  query={recording.query}
                  recordingId={recording.id}
                  response={recording.response}
                  variablesString={recording.variables}
                />
              ))}
              {show && valid ? (
                <SaveRecordingsButton onClick={() => form.submit()} />
              ) : null}
            </div>
          </form>
        )}
      />
    </SaveDrawerContainer>
  );
};
