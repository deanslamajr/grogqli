import path from 'path';
import {
  fetchRootTypeRecording,
  FetchRootTypeRecordingParams,
} from '../fetchRootTypeRecording';
import operationsData from '../../../../__tests__/grogqli/schemas/someSchemaId/operations.json';
import { getConfig } from '../../../../../../../getConfig';

jest.mock('../../../../../../../getConfig');

describe('fetchRootTypeRecording', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../../../__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });
  });

  it('should resolve a recording', async () => {
    const opName = 'someOpName';
    const config: FetchRootTypeRecordingParams = {
      opName,
      workflowId: 'someWorkflowId',
      operationsData,
    };
    const actual = await fetchRootTypeRecording(config);
    expect(actual).toMatchSnapshot();
  });

  describe('if a workflow file doesnt exist for the workflowId', () => {
    it('should throw', async () => {
      const opName = 'DoThing';
      const config: FetchRootTypeRecordingParams = {
        opName,
        workflowId: 'workflowDoesNotExist',
        operationsData: {
          version: 1,
          recordings: {
            [opName]: {
              opId: 'someOpId',
              typeId: 'someTypeId',
            },
          },
        },
      };

      await expect(fetchRootTypeRecording(config)).rejects.toThrow();
    });
  });
});
