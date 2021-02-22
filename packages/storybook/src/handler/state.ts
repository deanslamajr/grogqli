type SchemaMappings = { [schemaUrl: string]: string };

interface State {
  schemaMappings: SchemaMappings;
  workflowId: string | null;
}

let state: State;

const throwIfNotInitialized = () => {
  if (!state) {
    throw new Error('Handler state has not been initialized.');
  }
};

export const getSchemaId = (schemaUrl) => {
  throwIfNotInitialized();
  return state.schemaMappings[schemaUrl];
};

export const getWorkflowId = () => {
  throwIfNotInitialized();
  return state.workflowId;
};

export const setWorkflowId = (newWorkflowId) => {
  throwIfNotInitialized();
  state.workflowId = newWorkflowId;
};

type Initialize = (params: { schemaMappings: SchemaMappings }) => void;

export const initialize: Initialize = ({ schemaMappings }) => {
  state = {
    schemaMappings,
    workflowId: null,
  };
};
