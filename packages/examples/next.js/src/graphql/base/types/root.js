const Query = `
  type Query {
    thing: Thing
    anotherThing: AnotherThing
    someUnion: SomeUnion
    inputThings (
      input: InputThingInput!
      optionalInput: InputThingOptionalInput
    ): [InputThing]
  }
`;

module.exports = {
  Query,
};
