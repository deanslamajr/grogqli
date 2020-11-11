import path from 'path';

import { createResolvers } from '../createResolvers';
import schema from '../../../__tests__/grogqli/schemas/someSchemaId/schema.json';
import { getConfig } from '../../../../../../getConfig';

jest.mock('../../../../../../getConfig');

describe('createResolvers', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../../__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });
  });

  it('should return a resolver configuration that includes each type in the schema (ignoring gql internal types)', async () => {
    const actual = await createResolvers(schema as any);
    expect(actual).toMatchSnapshot();
  });
});
