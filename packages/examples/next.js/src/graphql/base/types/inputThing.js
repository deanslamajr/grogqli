const InputThing = `
  type InputThing {
    id: ID!
    type: InputThingType
    value: String
  }
`;

const InputThingInput = `
  input InputThingInput {
    type: InputThingType!
    limit: Int = 10
  }
`;

const InputThingType = `
  enum InputThingType {
    EMAIL
    DOMAIN
    IP
    MAC
  }
`;

const InputThingOptionalInput = `
  input InputThingOptionalInput {
    sortBy: SortBy!
    direction: Direction
  }
`;

const SortBy = `
  enum SortBy {
    NAME
    LENGTH
  }
`;

const Direction = `
  enum Direction {
    ASC
    DESC
  }
`;

const everything = `
  ${InputThing}
  ${InputThingInput}
  ${InputThingOptionalInput}
  ${InputThingType}
  ${SortBy}
  ${Direction}
`;

module.exports = {
  everything,
  InputThing,
  InputThingInput,
  InputThingOptionalInput,
  InputThingType,
  SortBy,
  Direction,
};
