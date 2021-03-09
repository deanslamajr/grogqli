const { buildSchema } = require('graphql');

const { Query } = require('./root');
const { Thing } = require('./thing');
const { AnotherThing } = require('./anotherThing');
const { HeresAnotherThing } = require('./heresAnotherThing');
const { SomeUnion } = require('./someUnion');

const typeDefs = [Query, Thing, AnotherThing, HeresAnotherThing, SomeUnion];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
  Query,
  Thing,
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
};
