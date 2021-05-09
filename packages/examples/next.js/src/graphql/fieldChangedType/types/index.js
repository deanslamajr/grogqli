const { buildSchema } = require('graphql');

const {
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
  Thing,
} = require('../../base/types');
const { Query } = require('./root');
const { YetAnotherThing } = require('./yetAnotherThing');

const typeDefs = [
  Query,
  Thing,
  AnotherThing,
  HeresAnotherThing,
  SomeUnion,
  YetAnotherThing,
];

const schema = buildSchema(typeDefs.join());

module.exports = {
  schema,
  typeDefs,
};
