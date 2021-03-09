const gql = require('graphql-tag');

const Thing = `
  type Thing {
    id: ID!
    name: String!
    streetName: String!
  }
`;

module.exports = {
  Thing,
};
