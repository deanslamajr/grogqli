import React, { FC, useMemo } from 'react';
import { Form, Field } from 'react-final-form';
import styled from 'styled-components';
import {
  GetSchemas,
  GetTempOpRecordings,
  SchemaRecording,
  CreateWorkflowRecordingPlan,
} from '@grogqli/schema';
import useKey from '@rooks/use-key';
import { useQuery, useMutation } from '@apollo/client';
import { Operation } from './Operation';
import { OperationRecordingPlans } from './Operation/types';

import { SaveRecordingsButton } from './SaveRecordingsButton';

import {
  NEW_SCHEMA_ID,
  SchemaMappingField,
  SchemasMapping,
} from './SchemaMappingField';
import { FormFieldContainer, InvalidFieldMessage } from './common';

const SaveDrawerContainer = styled.div<{ show: boolean }>`
  width: 100%;
  height: ${(props) => (props.show ? '100%' : 0)};
  top: ${(props) => (props.show ? 0 : '100%')};
  overflow: ${(props) => (props.show ? 'auto' : 'hidden')};
  background-color: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.black};
  transition: all 0.25s;
`;

const WorkflowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export interface CreateWorkflowForm {
  workflowName: string;
  workflowDescription: string;
  schemasMappings: Array<SchemasMapping>;
}

type SchemaMappingValidationErrors = Array<Partial<SchemasMapping>>;
type ValidationErrors = Partial<
  Pick<CreateWorkflowForm, 'workflowName' | 'workflowDescription'>
> & { schemasMappings?: SchemaMappingValidationErrors };

export interface SaveDrawerProps {
  handleClose: () => void;
  isMutationLoading: boolean;
  onCreateWorkflow: (values: CreateWorkflowForm) => Promise<void>;
  tempOpRecordingsToSave: GetTempOpRecordings.TemporaryOperationRecording[];
  show: boolean;
}

export const SaveDrawer: FC<SaveDrawerProps> = ({
  handleClose,
  isMutationLoading,
  onCreateWorkflow,
  tempOpRecordingsToSave,
  show,
}) => {
  useKey(['Escape'], handleClose);

  const { data: schemasData, loading: isGettingSchemas } = useQuery(
    GetSchemas.GetSchemasDocument,
    {
      fetchPolicy: 'network-only',
      skip: !show,
    }
  );

  // TODO query CreateWorkflowRecordingPlan on mount
  const [
    createWorkflowRecordingPlan,
    {
      data: createWorkflowRecordingPlanResult,
      loading: createWorkflowRecordingPlanIsLoading,
    },
  ] = useMutation(
    CreateWorkflowRecordingPlan.CreateWorkflowRecordingPlanDocument
  );

  React.useEffect(() => {
    const operations = tempOpRecordingsToSave.map<CreateWorkflowRecordingPlan.OperationRecordingsInput>(
      (operation) => ({
        tempRecordingId: operation.id,
        sessionId: operation.sessionId,
      })
    );
    createWorkflowRecordingPlan({
      variables: {
        input: {
          operations,
        },
      },
    });
  }, []);

  const operationRecordingPlans: OperationRecordingPlans | undefined =
    createWorkflowRecordingPlanResult?.createWorkflowRecordingPlan.newPlan
      .operationRecordingPlans;

  console.log('operationRecordingPlans', operationRecordingPlans);

  const validateForm = (values: CreateWorkflowForm): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!values.workflowName) {
      errors.workflowName = 'Required';
    }

    // validateSchemaMappings
    (() => {
      const schemaMappingsErrors = [] as SchemaMappingValidationErrors;
      values.schemasMappings.forEach((schemaMapping, index) => {
        if (
          schemaMapping.targetSchemaId === NEW_SCHEMA_ID &&
          (!schemaMapping.schemaName || schemaMapping.schemaName === '')
        ) {
          schemaMappingsErrors[index] = { schemaName: 'Required' };
        }
      });

      errors.schemasMappings = schemaMappingsErrors;
    })();

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
        schemaName: 'New Schema',
      };
    });

    return {
      workflowName: 'New Workflow',
      workflowDescription: '',
      schemasMappings,
    };
  }, [tempOpRecordingsToSave, schemasData]);

  return (
    <SaveDrawerContainer show={show}>
      {isMutationLoading && <div>Loading...</div>}
      <Form
        onSubmit={(values) => onCreateWorkflow(values)}
        initialValues={initialValues}
        validate={validateForm}
        render={({ form, valid }) => (
          <form>
            <WorkflowContainer>
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
            </WorkflowContainer>

            <SchemaMappingField
              isGettingSchemas={isGettingSchemas}
              schemas={schemasData?.schemas || undefined}
            />

            {operationRecordingPlans && operationRecordingPlans.length && (
              <>
                {operationRecordingPlans.map((plan) => (
                  <Operation plan={plan} />
                ))}
                {show && valid ? (
                  <SaveRecordingsButton onClick={() => form.submit()} />
                ) : null}
              </>
            )}
          </form>
        )}
      />
    </SaveDrawerContainer>
  );
};
