import { BreakingChangeType } from 'graphql';
import { SchemasMappingsInput } from '@grogqli/schema';
import path from 'path';

import { getConfig } from '../getConfig';
import {
  NEW_SCHEMA_NAME,
  conditionallyCreateOrUpdateSchemaRecordings,
  SchemaDifferences,
} from '../schema';

jest.mock('../getConfig');

const targetSchemaId = 'eyTM1L3ePih+d1+vZwCnzlnGN5o=';

const typeRemovedSchemaId = '97jD87sI+JLUb99xYkPXlVtvtHk=';
const fieldChangedKindSchemaId = 'B6FHTGjY5ejQq2ckbPXxMvMzzbA=';
const typeRemovedFromUnionSchemaId = 'eOTkDl4oHYMTKMNQkBh548JAzTM=';

describe('conditionallyCreateOrUpdateSchemaRecordings', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'schema_tests_grogqli');
    });
  });

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

  describe(`if a given schemaMapping.targetSchemaId !== 'NEW'`, () => {
    describe('if the given schemaMapping.opsRecordingsSchemaHash does not match the hash associated with the given schemaMapping.targetSchemaId', () => {
      describe('testing particular schema changes', () => {
        describe('if a type`s field is changed to target a different type', () => {
          it('should detect FIELD_CHANGED_KIND', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: fieldChangedKindSchemaId,
                opsRecordingsSchemaUrl: '',
                targetSchemaId: targetSchemaId,
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');

            expect(
              (actual[0] as SchemaDifferences).breakingChanges
            ).toMatchSnapshot();
          });
        });
      });
      describe('testing all detectable cases from graphql::BreakingChangeType', () => {
        describe('if there is a breaking change: TYPE_REMOVED', () => {
          it('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: typeRemovedSchemaId,
                opsRecordingsSchemaUrl: '',
                targetSchemaId: targetSchemaId,
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');

            expect((actual[0] as SchemaDifferences).breakingChanges).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: BreakingChangeType.TYPE_REMOVED,
                }),
              ])
            );
          });
        });

        describe('if there is a breaking change: TYPE_CHANGED_KIND', () => {
          it('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: fieldChangedKindSchemaId,
                opsRecordingsSchemaUrl: '',
                targetSchemaId: targetSchemaId,
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');

            expect((actual[0] as SchemaDifferences).breakingChanges).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: BreakingChangeType.FIELD_CHANGED_KIND,
                }),
              ])
            );
          });
        });

        describe('if there is a breaking change: TYPE_REMOVED_FROM_UNION', () => {
          it('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: typeRemovedFromUnionSchemaId,
                opsRecordingsSchemaUrl: '',
                targetSchemaId: targetSchemaId,
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');

            expect((actual[0] as SchemaDifferences).breakingChanges).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
                }),
              ])
            );
          });
        });

        describe('if there is a breaking change: VALUE_REMOVED_FROM_ENUM', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: typeRemovedFromUnionSchemaId,
                opsRecordingsSchemaUrl: '',
                targetSchemaId: targetSchemaId,
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');

            expect((actual[0] as SchemaDifferences).breakingChanges).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
                }),
              ])
            );
          });
        });

        describe('if there is a breaking change: REQUIRED_INPUT_FIELD_ADDED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: IMPLEMENTED_INTERFACE_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: FIELD_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'zvSSFn5pRuwYggaWFliVi1Z7niY=',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: targetSchemaId,
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');

            expect((actual[0] as SchemaDifferences).breakingChanges).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  type: BreakingChangeType.FIELD_REMOVED,
                }),
              ])
            );
          });
        });

        describe('if there is a breaking change: FIELD_CHANGED_KIND', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: REQUIRED_ARG_ADDED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: ARG_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: ARG_CHANGED_KIND', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: DIRECTIVE_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: DIRECTIVE_ARG_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: REQUIRED_DIRECTIVE_ARG_ADDED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: DIRECTIVE_REPEATABLE_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });

        describe('if there is a breaking change: DIRECTIVE_LOCATION_REMOVED', () => {
          xit('should return info about the breaking change', async () => {
            const schemaMappings: SchemasMappingsInput[] = [
              {
                opsRecordingsSchemaHash: 'hashOfSomeSchemaWithATypeRemoved',
                opsRecordingsSchemaUrl: '',
                targetSchemaId: 'someSchemaId',
                schemaName: null,
              },
            ];

            const actual = await conditionallyCreateOrUpdateSchemaRecordings(
              schemaMappings
            );

            expect(actual).toHaveLength(1);
            expect(actual[0]).toHaveProperty('breakingChanges');
            expect(actual).toMatchSnapshot();
          });
        });
      });
    });

    describe('if the given schemaMapping.opsRecordingsSchemaHash matches the hash associated with the given schemaMapping.targetSchemaId', () => {
      it('should resolve the expected data', async () => {
        const testSchema = require(`./schema_tests_grogqli/schemas/${targetSchemaId}/schema.json`);

        const schemaMappings: SchemasMappingsInput[] = [
          {
            opsRecordingsSchemaHash: testSchema.hash,
            opsRecordingsSchemaUrl: '',
            targetSchemaId,
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
