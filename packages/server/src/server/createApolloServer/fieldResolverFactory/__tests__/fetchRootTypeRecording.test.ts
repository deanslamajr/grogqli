import path from 'path';
import {
  fetchRootTypeRecording,
  FetchRootTypeRecordingParams,
} from '../fetchRootTypeRecording';

import operationsData from '../../../files/__tests__/grogqli/schemas/someSchemaId/operations.json';
import typeNameToIdMappingData from '../../../files/__tests__/grogqli/schemas/someSchemaId/types.json';
import { getConfig } from '../../../files/getConfig';

jest.mock('../../../files/getConfig');

describe('fetchRootTypeRecording', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../../files/__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });
  });

  it('should resolve a recording', async () => {
    const opName = 'someOpName';
    const rootTypeName = 'Query';
    const config: FetchRootTypeRecordingParams = {
      opName,
      workflowId: 'someWorkflowId',
      operationsData,
      rootTypeName,
      typeNameToIdMappingData,
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
          operations: {
            [opName]: {
              id: 'someOpId',
              name: opName,
            },
          },
        },
      };

      await expect(
        fetchRootTypeRecording(config)
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
