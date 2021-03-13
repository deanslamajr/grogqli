const { buildSchema } = require('graphql');

const {
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
} = require('../../base/types');
const { Query } = require('./root');

const typeDefs = [Query, AnotherThing, HeresAnotherThing, SomeUnion];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
};
