import path from 'path';

import { openTypeNameToIdMapping, getTypeRecording } from '..';
import { getConfig } from '../../getConfig';

jest.mock('../../getConfig');

describe('type', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, '..', '..', '__tests__', 'grogqli');
    });
  });

  describe('openTypeNameToIdMapping', () => {
    it('should return the operations file associated with the given schemaId', async () => {
      const actual = await openTypeNameToIdMapping('someSchemaId');
      expect(actual).toMatchSnapshot();
    });

    describe('if an operations file cannot be found that matches the given schemaId', () => {
      it('should throw', async () => {
        await expect(
          openTypeNameToIdMapping('nonexistentSchemaId')
        ).rejects.toThrow();
      });
    });
  });

  describe('getTypeRecording', () => {
    it('should return the correct type recording', async () => {
      const typeId = 'someTypeId';
      const recordingId = 'someTypeRecordingId';
      const actual = await getTypeRecording({ typeId, recordingId });
      expect(actual).toMatchSnapshot();
    });

    describe('if file for given typeId does not exist', () => {
      it('should throw', async () => {
        const typeId = 'nonexistentTypeId';
        const recordingId = 'someTypeRecordingId';
        await expect(
          getTypeRecording({ typeId, recordingId })
        ).rejects.toThrow();
      });
    });

    describe('if type file doesnt have a recording for the given recording id', () => {
      it('should throw', async () => {
        const typeId = 'someTypeId';
        const recordingId = 'nonexistentRecordingId';
        await expect(
          getTypeRecording({ typeId, recordingId })
        ).rejects.toThrow();
      });
    });
  });
});
