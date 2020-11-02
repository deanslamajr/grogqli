import path from 'path';
import { getWorkflowById } from '../files';
import { getConfig } from '../../../../getConfig';

jest.mock('../../../../getConfig');

describe('files', () => {
  describe('getWorkflowById', () => {
    beforeEach(() => {
      const mockedGetConfig = getConfig as jest.MockedFunction<
        typeof getConfig
      >;
      mockedGetConfig.mockImplementation(async () => () => {
        return path.join(__dirname, 'grogqli');
      });
    });

    it('should return the given workflow file contents', async () => {
      const actual = await getWorkflowById('someWorkflowId');
      expect(actual).toMatchSnapshot();
    });

    describe('if workflowId is not passed', () => {
      it('should return null', async () => {
        const actual = await getWorkflowById();
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
});
