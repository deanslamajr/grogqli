import path from 'path';
import { getSchema } from '..';
import { getConfig } from '../getConfig';

jest.mock('../getConfig');

describe('files', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'grogqli');
    });
  });

  describe('getSchema', () => {
    it('should return the schema file associated with the given schemaId', async () => {
      const schemaId = 'someSchemaId';
      const actual = await getSchema(schemaId);
      expect(actual.id).toBe(schemaId);
    });

    describe('if a schema file cannot be found that matches the given schemaId', () => {
      it('should throw', async () => {
        await expect(getSchema('nonexistentSchemaId')).rejects.toThrow();
      });
    });
  });
});
