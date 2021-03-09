const gql = require('graphql-tag');

const SomeUnion = `
  union SomeUnion = Thing | AnotherThing | HeresAnotherThing
`;

module.exports = {
  SomeUnion,
};
