import { createResolvers } from '../createResolvers';
import schema from './schemas/schema.json';

describe('createResolvers', () => {
  xit('should return a resolver configuration that includes each type in the schema (ignoring gql internal types)', () => {
    const actual = createResolvers(schema);
    expect(actual).toMatchSnapshot();
  });
});
