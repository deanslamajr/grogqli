import path from 'path';

import { fieldResolverFactory, ResolveValueFactoryParams } from '..';
import schema from '../../../../__tests__/grogqli/schemas/someSchemaId/schema.json';
import operationsData from '../../../../__tests__/grogqli/schemas/someSchemaId/operations.json';
import typeNameToIdMappingData from '../../../../__tests__/grogqli/schemas/someSchemaId/types.json';
import { getConfig } from '../../../../../../../getConfig';
import { Context } from '../../createApolloServer';
import someWorkflowFile from '../../../../__tests__/grogqli/workflows/someWorkflowId.json';

jest.mock('../../../../../../../getConfig');
jest.mock('../../../../__tests__/grogqli/workflows/someWorkflowId.json');

describe('fieldResolverFactory', () => {
  let fieldResolverFactoryArgs: ResolveValueFactoryParams;
  let info: any;
  let context: Context;
  let mockedWorkflowFile: jest.Mocked<typeof someWorkflowFile>;

  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../../../__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });

    mockedWorkflowFile = someWorkflowFile as jest.Mocked<
      typeof someWorkflowFile
    >;
    const actualWorkflowFile = jest.requireActual(
      '../../../../__tests__/grogqli/workflows/someWorkflowId.json'
    );
    mockedWorkflowFile.recordings = actualWorkflowFile.recordings;

    fieldResolverFactoryArgs = {
      schema: schema.introspectionQuery as any,
      operationsData,
      parentTypeName: schema.introspectionQuery.__schema.queryType.name,
      fieldName: 'getAccountFromSession',
      typeNameToIdMappingData,
    };

    info = {
      operation: {
        name: {
          value: 'someOpName',
        },
      },
    };

    context = {
      schemaId: 'someSchemaId',
      runTimeVariables: {
        grogqli: { workflowId: 'someWorkflowId' },
      },
    };
  });

  it('should return a resolver function', () => {
    const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

    expect(typeof resolveField).toBe('function');
  });

  describe('a resolver function created from a fieldResolverFactory invocation', () => {
    describe('an unnamed operation', () => {
      it('should throw', async () => {
        const infoWithUnnamedOp = {
          ...info,
          operation: {},
        };

        const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

        await expect(
          resolveField({}, {}, context, infoWithUnnamedOp)
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });

    describe('root type case', () => {
      it('should return the value associated with the given fieldName', async () => {
        const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

        const actual = await resolveField({}, {}, context, info);

        expect(actual).toMatchSnapshot();
      });

      describe('if a workflow file cannot be found for the given workflowId', () => {
        it('should throw', async () => {
          const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

          const contextWithNonexistentWorkflow = {
            ...context,
            runTimeVariables: {
              ...context.runTimeVariables,
              grogqli: {
                ...context.runTimeVariables.grogqli,
                workflowId: 'nonexistentWorkflowId',
              },
            },
          };

          await expect(
            resolveField({}, {}, contextWithNonexistentWorkflow, info)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });

      describe('if the operations file does not have an recording for the given operation', () => {
        it('should throw', async () => {
          const infoWithUnrecordedOp = {
            ...info,
            operation: {
              name: {
                value: 'unrecordedOpName',
              },
            },
          };

          const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

          await expect(
            resolveField({}, {}, context, infoWithUnrecordedOp)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });

      describe('if the workflow file does not have an operation recording for the given operation', () => {
        it('should throw', async () => {
          const argsWithNonExistentOpId = {
            ...fieldResolverFactoryArgs,
            operationsData: {
              ...operationsData,
              recordings: {
                ...operationsData.recordings,
                someOpName: {
                  ...operationsData.recordings.someOpName,
                  opId: 'nonExistentOpId',
                },
              },
            },
          };

          const resolveField = fieldResolverFactory(argsWithNonExistentOpId);

          await expect(
            resolveField({}, {}, context, info)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });

      describe('if a type file cannot be found for the given root type', () => {
        it('should throw', async () => {
          const nonExistentRootTypeName = 'NonExistentRootType';
          const argsWithNonExistentRootType = {
            ...fieldResolverFactoryArgs,
            operationsData: {
              ...operationsData,
              recordings: {
                ...operationsData.recordings,
                someOpName: {
                  ...operationsData.recordings.someOpName,
                  typeId: nonExistentRootTypeName,
                },
              },
            },
          };
          const resolveField = fieldResolverFactory(
            argsWithNonExistentRootType
          );

          await expect(
            resolveField({}, {}, context, info)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });

      describe('if the root type file does not have a recording instance for the given recordingId', () => {
        it('should throw', async () => {
          mockedWorkflowFile.recordings = {
            ...mockedWorkflowFile.recordings,
            someOpId: {
              ...mockedWorkflowFile.recordings.someOpId,
              rootTypeRecordingId: 'nonExistentRecordingId',
            },
          };

          const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

          await expect(
            resolveField({}, {}, context, info)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });

      describe('if the root type recording does not have an entry for the given fieldName', () => {
        it('should throw', async () => {
          const argsWithNonExistentFieldName = {
            ...fieldResolverFactoryArgs,
            fieldName: 'nonExistentFieldName',
          };
          const resolveField = fieldResolverFactory(
            argsWithNonExistentFieldName
          );

          await expect(
            resolveField({}, {}, context, info)
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });
    });

    describe('nested type case', () => {
      it('need to write these tests', () => {
        throw new Error('write these tests!!!');
      });
    });
  });
});
