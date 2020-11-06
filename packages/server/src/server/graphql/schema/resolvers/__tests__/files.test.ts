import path from 'path';
import { getWorkflowById, getTypeRecording } from '../files';
import { getConfig } from '../../../../getConfig';

jest.mock('../../../../getConfig');

describe('files', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'grogqli');
    });
  });

  describe('getWorkflowById', () => {
    it('should return the given workflow file contents', async () => {
      const actual = await getWorkflowById('someWorkflowId');
      expect(actual).toMatchSnapshot();
    });

    describe('if workflowId is not passed', () => {
      it('should return null', async () => {
        const actual = await getWorkflowById('');
        expect(actual).toBeNull();
      });
    });

    describe('if the file doesnt exist', () => {
      it('should return null', async () => {
        const actual = await getWorkflowById('workFlowDoesntExist');
        expect(actual).toBeNull();
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
