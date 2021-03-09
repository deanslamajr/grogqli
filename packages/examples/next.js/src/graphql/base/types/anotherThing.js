const gql = require('graphql-tag');

const AnotherThing = `
  type AnotherThing {
    id: ID!
    name: String!
    product: String!
  }
`;

module.exports = {
  AnotherThing,
};
