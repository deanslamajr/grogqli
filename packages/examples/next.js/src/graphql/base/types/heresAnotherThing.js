const gql = require('graphql-tag');

const HeresAnotherThing = `
  type HeresAnotherThing {
    id: ID!
    accountName: String!
    currencySymbol: String!
  }
`;

module.exports = {
  HeresAnotherThing,
};
