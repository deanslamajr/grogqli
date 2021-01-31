import React, { FC, useMemo } from 'react';
import { Form, Field } from 'react-final-form';
import styled, { css } from 'styled-components';
import { format } from 'graphql-formatter';
import { GetTempOpRecordings, CreateWorkflow } from '@grogqli/schema';
import useKey from '@rooks/use-key';
import { useMutation } from '@apollo/client';

import { SaveRecordingsButton } from '../SaveRecordingsButton';

import { SchemaMappingField } from './SchemaMappingField';

const { CreateWorkflowDocument } = CreateWorkflow;

interface SaveDrawerProps {
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

export const formFieldStyles = () => {
  return css`
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
    width: ${({ theme }) => theme.sizes.formFieldWidth};
    min-height: unset;
    font-family: ${({ theme }) => theme.font};
    font-size: 16px;
    padding: 0.5rem 0 !important;
  `;
};

export const FormFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 2rem;
  align-items: center;

  & input,
  & textarea {
    ${formFieldStyles()}
  }

  & input {
    height: unset;
  }

  & textarea {
    height: 7rem;
    resize: none;
  }
`;

export const InvalidFieldMessage = styled.div`
  color: ${({ theme }) => theme.colors.red};
  height: 1rem;
  padding: 0.15rem;
`;

interface CreateWorkflowForm {
  workflowName: string;
  workflowDescription: string;
  schemasMapping: Array<{
    id: string;
    url: string;
  }>;
}

type ValidationErrors = Partial<CreateWorkflowForm>;

export const SaveDrawer: FC<SaveDrawerProps> = ({
  handleClose,
  tempOpRecordingsToSave,
  show,
}) => {
  useKey(['Escape'], handleClose);
  const [createWorkflow] = useMutation(CreateWorkflowDocument);

  const _createWorkflow = ({
    workflowName,
    workflowDescription,
    schemasMapping,
  }: CreateWorkflowForm) => {
    const operations = tempOpRecordingsToSave.map(({ id }) => ({
      tempRecordingId: id,
    }));

    createWorkflow({
      variables: {
        input: {
          operations,
          workflow: {
            name: workflowName,
            description: workflowDescription,
          },
          schemasMapping,
        },
      },
    });
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
    const tempSchemaRecordingIds = tempOpRecordingsToSave.map(
      ({ tempSchemaRecordingId }) => tempSchemaRecordingId
    );
    const setOfTempSchemaRecordingIds = new Set(tempSchemaRecordingIds);
    const uniqueTempSchemaRecordingIds = Array.from(
      setOfTempSchemaRecordingIds
    );

    const schemaMappings = uniqueTempSchemaRecordingIds.map(
      (tempSchemaRecordingId) => ({
        url: tempSchemaRecordingId,
        id: '',
      })
    );

    return {
      workflowName: '',
      workflowDescription: '',
      schemasMapping: schemaMappings,
    };
  }, [tempOpRecordingsToSave]);

  return (
    <SaveDrawerContainer show={show}>
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

              <SchemaMappingField />

              {tempOpRecordingsToSave.map((recording) => (
                <OperationContainer key={recording.id}>
                  <OperationName>{recording.operationName}</OperationName>
                  <Code>{format(recording.query)}</Code>
                  <Code>
                    {JSON.stringify(
                      JSON.parse(recording?.response || ''),
                      null,
                      2
                    )}
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
