import { introspectionQuery } from './grogqli/schemas/someSchemaId/schema.json';

import { generateHashFromSchema } from '../tempSchemaRecording';

describe('tempSchemaRecording', () => {
  describe('generateHashFromSchema', () => {
    it('should generate a stable hash', async () => {
      // @ts-ignore
      const firstHash = await generateHashFromSchema(introspectionQuery);
      // @ts-ignore
      const secondHash = await generateHashFromSchema(introspectionQuery);

      expect(firstHash).toEqual(secondHash);
      expect(firstHash).toMatchSnapshot();
    });
  });
});
