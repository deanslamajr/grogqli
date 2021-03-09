const gql = require('graphql-tag');

const Query = `
  type Query {
    thing: Thing
    anotherThing: AnotherThing
    someUnion: SomeUnion
  }
`;

module.exports = {
  Query,
};
