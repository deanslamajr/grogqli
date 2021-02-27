import { SchemasMappingsInput } from '@grogqli/schema';
import path from 'path';

import testSchema from './schema_tests_grogqli/schemas/someSchemaId/schema.json';

import { getConfig } from '../getConfig';
import {
  NEW_SCHEMA_NAME,
  conditionallyCreateOrUpdateSchemaRecordings,
} from '../schema';

jest.mock('../getConfig');

describe('schema', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'schema_tests_grogqli');
    });
  });

  describe('conditionallyCreateOrUpdateSchemaRecordings', () => {
    describe(`if a given schemaMapping.targetSchemaId === 'NEW'`, () => {
      describe('if schemaMapping.schemaName === null', () => {
        it('should throw', async () => {
          const schemaMappings: SchemasMappingsInput[] = [
            {
              opsRecordingsSchemaHash: '',
              opsRecordingsSchemaUrl: '',
              targetSchemaId: NEW_SCHEMA_NAME,
              schemaName: null,
            },
          ];

          await expect(
            conditionallyCreateOrUpdateSchemaRecordings(schemaMappings)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });
    });
  });

  describe(`if a given schemaMapping.targetSchemaId !== 'NEW'`, () => {
    describe('if the given schemaMapping.opsRecordingsSchemaHash does not match the hash associated with the given schemaMapping.targetSchemaId', () => {
      it('should throw', async () => {
        const schemaMappings: SchemasMappingsInput[] = [
          {
            opsRecordingsSchemaHash: 'aHashThatDoesntMatch',
            opsRecordingsSchemaUrl: '',
            targetSchemaId: 'someSchemaId',
            schemaName: null,
          },
        ];

        await expect(
          conditionallyCreateOrUpdateSchemaRecordings(schemaMappings)
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });

    describe('if the given schemaMapping.opsRecordingsSchemaHash matches the hash associated with the given schemaMapping.targetSchemaId', () => {
      it('should resolve the expected data', async () => {
        const schemaMappings: SchemasMappingsInput[] = [
          {
            opsRecordingsSchemaHash: testSchema.hash,
            opsRecordingsSchemaUrl: '',
            targetSchemaId: 'someSchemaId',
            schemaName: null,
          },
        ];

        await expect(
          conditionallyCreateOrUpdateSchemaRecordings(schemaMappings)
        ).resolves.toMatchSnapshot();
      });
    });
  });
});
