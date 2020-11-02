import { resolveQueryFromRecording, ResolveQueryFromRecordingParams } from '..';

describe('resolveQueryFromRecording', () => {
  it('should execute the given query', async () => {
    const query =
      'query GetChores {\n  getChores {\n    chores {\n      id\n      summary\n      description\n      dueDate\n      version\n      __typename\n    }\n    hasAccountSession\n    __typename\n  }\n}\n';
    const queryConfig: ResolveQueryFromRecordingParams = {
      query,
    };
    const actual = await resolveQueryFromRecording(queryConfig);
    console.log('actual', actual);
    expect(actual).toMatchSnapshot();
  });
});
