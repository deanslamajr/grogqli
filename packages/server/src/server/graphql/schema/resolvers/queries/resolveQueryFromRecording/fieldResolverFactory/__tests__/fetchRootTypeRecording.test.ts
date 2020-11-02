import {
  fetchRootTypeRecording,
  FetchRootTypeRecordingParams,
} from '../fetchRootTypeRecording';

describe('fetchRootTypeRecording', () => {
  it('should resolve a recording', () => {
    const opName = 'DoThing';
    const config: FetchRootTypeRecordingParams = {
      opName,
      workflowId: 'someWorkflowId',
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
    const actual = fetchRootTypeRecording(config);
    expect(actual).toMatchSnapshot();
  });
});
