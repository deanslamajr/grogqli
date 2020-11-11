import path from 'path';

import { fetchNestedTypeRecording } from '../fetchNestedTypeRecording';
import { getConfig } from '../../../../../../../getConfig';
import typeNameToIdMappingData from '../../../../__tests__/grogqli/schemas/someSchemaId/types.json';

jest.mock('../../../../../../../getConfig');

describe('fetchNestedTypeRecording', () => {
  const schemaId = 'someSchemaId';
  const recordingId = 'someTypeRecordingId';
  const typeName = 'someTypeName';

  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../../../__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });
  });

  it('should return a type recording value', async () => {
    const actual = await fetchNestedTypeRecording({
      recordingId,
      typeName,
      typeNameToIdMappingData,
    });
    expect(actual).toMatchSnapshot();
  });

  describe('if there isnt a reference to the given typeName in the given typeNameToIdMappingData', () => {
    it('should throw', async () => {
      await expect(
        fetchNestedTypeRecording({
          recordingId,
          typeName: 'nonExistentTypeName',
          typeNameToIdMappingData,
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('if there isnt a type file for the given typeName', () => {
    it('should throw', async () => {
      await expect(
        fetchNestedTypeRecording({
          recordingId,
          typeName: 'doesntHaveATypeFile',
          typeNameToIdMappingData,
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('if the type file for the given typeName does not have a reference to the given recordingId', () => {
    it('should throw', async () => {
      await expect(
        fetchNestedTypeRecording({
          recordingId: 'nonExistentTypeRecordingId',
          typeName,
          typeNameToIdMappingData,
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
