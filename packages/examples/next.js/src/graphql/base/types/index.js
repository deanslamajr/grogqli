const { buildSchema } = require('graphql');

const { Query } = require('./root');
const { Thing } = require('./thing');
const { AnotherThing } = require('./anotherThing');
const { HeresAnotherThing } = require('./heresAnotherThing');
const { SomeUnion } = require('./someUnion');
const { everything } = require('./inputThing');

const typeDefs = [
  Query,
  Thing,
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
  everything,
];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
  Query,
  Thing,
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
  everything,
};
