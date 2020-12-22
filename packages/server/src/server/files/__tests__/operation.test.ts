import { loadOperationsMappingFile } from '../operation';
import { getConfig } from '../getConfig';
import path from 'path';

jest.mock('../getConfig');

describe('operation', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'grogqli');
    });
  });

  describe('getOperationsData', () => {
    it('should return the operations file associated with the given schemaId', async () => {
      const actual = await loadOperationsMappingFile('someSchemaId');
      expect(actual).toMatchSnapshot();
    });

    describe('if an operations file cannot be found that matches the given schemaId', () => {
      it('should throw', async () => {
        await expect(
          loadOperationsMappingFile('nonexistentSchemaId')
        ).rejects.toThrow();
      });
    });
  });
});
