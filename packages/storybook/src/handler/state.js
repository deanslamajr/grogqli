let state;

const throwIfNotInitialized = () => {
  if (!state) {
    throw new Error('Handler state has not been initialized.');
  }
};

export const getSchemaId = (schemaUrl) => {
  throwIfNotInitialized();
  return state.schemaMappings[schemaUrl];
}

export const getWorkflowId = () => {
  throwIfNotInitialized();
  return state.workflowId;
};

export const setWorkflowId = (newWorkflowId) => {
  console.log('taco')
  throwIfNotInitialized();
  state.workflowId = newWorkflowId;
};

export const initialize = ({
  schemaMappings
}) => {
  state = {
    schemaMappings,
    workflowId: null
  };
};