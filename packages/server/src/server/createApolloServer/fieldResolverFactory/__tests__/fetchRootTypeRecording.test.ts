import path from 'path';
import {
  fetchRootTypeRecording,
  FetchRootTypeRecordingParams,
} from '../fetchRootTypeRecording';
import { getConfig } from '../../../files/getConfig';
import { TypeNameToIdMappingVersion1 } from '../../../files/type';
import { OperationNameToIdMapping } from '../../../files/operation';

import operationsData from '../../../files/__tests__/grogqli/schemas/someSchemaId/operations.json';
import typeNameToIdMappingData from '../../../files/__tests__/grogqli/schemas/someSchemaId/types.json';

jest.mock('../../../files/getConfig');

describe('fetchRootTypeRecording', () => {
  const rootTypeName = 'Query';
  const args = {}; // TODO: this hardcoded value is arbitrary and should be considered replaceable. This was done to satisfy the type checker.

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
    const config: FetchRootTypeRecordingParams = {
      args,
      opName,
      workflowId: 'someWorkflowId',
      operationsData: operationsData as OperationNameToIdMapping,
      rootTypeName,
      typeNameToIdMappingData: typeNameToIdMappingData as TypeNameToIdMappingVersion1,
    };
    const actual = await fetchRootTypeRecording(config);
    expect(actual).toMatchSnapshot();
  });

  describe('if a workflow file doesnt exist for the workflowId', () => {
    it('should throw', async () => {
      const opName = 'DoThing';
      const config: FetchRootTypeRecordingParams = {
        args,
        opName,
        rootTypeName,
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
        typeNameToIdMappingData: typeNameToIdMappingData as TypeNameToIdMappingVersion1,
      };

      await expect(
        fetchRootTypeRecording(config)
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
