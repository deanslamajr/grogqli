const { buildSchema } = require('graphql');

const {
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
  Thing,
} = require('../../base/types');
const { Query } = require('./root');

const typeDefs = [Query, Thing, AnotherThing, HeresAnotherThing, SomeUnion];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
};
