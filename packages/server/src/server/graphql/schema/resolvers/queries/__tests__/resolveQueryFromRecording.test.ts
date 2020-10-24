import { resolver } from '../resolveQueryFromRecording';

describe('resolveQueryFromRecording', () => {
  it('should execute the given query', async () => {
    const actual = await resolver();
    expect(actual).toBe({});
  });
});
