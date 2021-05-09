const { buildSchema } = require('graphql');

const {
  AnotherThing,
  HeresAnotherThing,
  Query,
  Thing,
} = require('../../base/types');
const { SomeUnion } = require('./someUnion');

const typeDefs = [Query, AnotherThing, HeresAnotherThing, Thing, SomeUnion];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
};
