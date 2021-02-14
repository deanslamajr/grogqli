import React, { FC, useMemo } from 'react';
import { Form, Field } from 'react-final-form';
import styled from 'styled-components';
import { format } from 'graphql-formatter';
import {
  GetSchemas,
  GetTempOpRecordings,
  CreateWorkflow,
  SchemaRecording,
} from '@grogqli/schema';
import useKey from '@rooks/use-key';
import { useMutation, useQuery } from '@apollo/client';

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

const OperationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
  margin-bottom: 5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.whiteDark};
`;

const OperationName = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const Code = styled.pre`
  padding: 0.15rem 0.25rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const SaveDrawerContainer = styled.div<{ show: boolean }>`
  position: absolute;
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

type ValidationErrors = Partial<CreateWorkflowForm>;

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
            schemasMappings,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  // TODO
  // * add an effect that reduces tempOpRecordingsToSave => uniqueTempSchemaRecordingIds
  // * then makes a query for
  //  * the schemaUrls associated with each tempSchemaRecordingId
  //  * the list of schemaRecordings e.g. {id, name, schemaUrl}
  // * Have <SchemaMappingField /> require the user to select a schemaRecording for each tempSchemaRecordingId

  const validateForm = (values: CreateWorkflowForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    const requiredError = 'Required';

    if (!values.workflowName) {
      errors.workflowName = requiredError;
    }
    if (!values.workflowDescription) {
      errors.workflowDescription = requiredError;
    }

    return errors;
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
                <OperationContainer key={recording.id}>
                  <OperationName>{recording.operationName}</OperationName>
                  <Code>{format(recording.query)}</Code>
                  <Code>
                    {JSON.stringify(recording?.response || {}, null, 2)}
                  </Code>
                </OperationContainer>
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
