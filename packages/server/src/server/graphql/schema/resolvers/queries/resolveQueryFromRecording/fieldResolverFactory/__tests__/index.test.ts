import { fieldResolverFactory } from '..';
import schema from '../../__tests__/schemas/schema.json';
import info from '../../__tests__/schemas/info.json';

describe('fieldResolverFactory', () => {
  describe('returns a function', () => {
    let resolveField;
    beforeEach(() => {
      resolveField = fieldResolverFactory({ schema });
    });

    xit('should handle the root field case', () => {});

    xit('should return the type instance', () => {
      const actual = resolveField(undefined, {}, {}, info);
      expect(actual).toMatchSnapshot();
    });

    describe('if type instance doesnt exist', () => {
      xit('should', () => {});
    });
  });
});
