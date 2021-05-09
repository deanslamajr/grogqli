const { buildSchema } = require('graphql');

const {
  HeresAnotherThing,
  Query,
  SomeUnion,
  AnotherThing,
} = require('../../base/types');
const { Thing } = require('./thing');

const typeDefs = [Query, Thing, AnotherThing, HeresAnotherThing, SomeUnion];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
};
