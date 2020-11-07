import { fieldResolverFactory } from '..';
import schema from '../../../../__tests__/grogqli/schemas/someSchemaId/schema.json';
import operationsData from '../../../../__tests__/grogqli/schemas/someSchemaId/operations.json';

describe('fieldResolverFactory', () => {
  describe('returns a function', () => {
    it('should handle the root field case', async () => {
      const resolveField = fieldResolverFactory({
        schema: schema.introspectionQuery,
        operationsData,
        parentTypeName: schema.introspectionQuery.__schema.queryType.name,
        fieldName: 'needToFixTheSchema',
      });

      const info = {
        operation: {
          name: {
            value: 'someOpName',
          },
        },
      };

      const actual = await resolveField(
        {},
        {},
        {
          schemaId: 'someSchemaId',
          runTimeVariables: { grogqli: { workflowId: 'someWorkFlowId' } },
        },
        info
      );

      expect(actual).toMatchSnapshot();
    });

    xit('should return the type instance', () => {
      const actual = resolveField(undefined, {}, {}, info);
      expect(actual).toMatchSnapshot();
    });

    describe('if type instance doesnt exist', () => {
      xit('should', () => {});
    });
  });
});
