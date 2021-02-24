let publicPath;
const schemaMappings = {
  'someUrl.com/graphql': 'someSchemaId',
};

export const parameters = {
  grogqli: {
    publicPath,
    schemaMappings: {
      ...schemaMappings,
    },
  },
};
