import path from 'path';

import { resolveQueryFromRecording, ResolveQueryFromRecordingParams } from '..';
import { getConfig } from '../../files/getConfig';

jest.mock('../../files/getConfig');

describe('resolveQueryFromRecording', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../files/__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });
  });

  it('should execute the given query', async () => {
    const query =
      'query GetChores {\n  getChores {\n    chores {\n      id\n      summary\n      description\n      dueDate\n      version\n      __typename\n    }\n    hasAccountSession\n    __typename\n  }\n}\n';
    const queryConfig: ResolveQueryFromRecordingParams = {
      query,
      schemaId: 'someSchemaId',
      workflowId: 'someWorkflowId',
      variables: {},
    };
    const actual = await resolveQueryFromRecording(queryConfig);
    expect(actual).toMatchSnapshot();
  });
});
