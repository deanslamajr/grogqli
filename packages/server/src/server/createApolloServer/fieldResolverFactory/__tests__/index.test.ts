import path from 'path';

import { fieldResolverFactory, ResolveValueFactoryParams } from '..';
import { Context } from '../..';
import { getConfig } from '../../../files/getConfig';
import { OperationFile } from '../../../files/operation';

import schema from '../../../files/__tests__/grogqli/schemas/someSchemaId/schema.json';
import operationsData from '../../../files/__tests__/grogqli/schemas/someSchemaId/operations.json';
import typeNameToIdMappingData from '../../../files/__tests__/grogqli/schemas/someSchemaId/types.json';
// import someWorkflowFile from '../../../files/__tests__/grogqli/workflows/someWorkflowId.json';
import someOperationFile from '../../../files/__tests__/grogqli/operations/someOpId.json';

jest.mock('../../../files/getConfig');
jest.mock('../../../files/__tests__/grogqli/operations/someOpId.json');

describe('fieldResolverFactory', () => {
  let fieldResolverFactoryArgs: ResolveValueFactoryParams;
  let info: any;
  let context: Context;
  let mockedOperationFile: jest.Mocked<OperationFile>;

  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize(
        '../../../files/__tests__/grogqli'
      );
      return path.join(__dirname, relativePathToTestGrogqli);
    });

    mockedOperationFile = someOperationFile as jest.Mocked<OperationFile>;
    const actualOperationFile = jest.requireActual(
      '../../../files/__tests__/grogqli/operations/someOpId.json'
    );
    mockedOperationFile.recordings = actualOperationFile.recordings;

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

      describe('if the workflow file does not have an entry for the given operation id', () => {
        it('should throw', async () => {
          const argsWithNonExistentOpId = {
            ...fieldResolverFactoryArgs,
            operationsData: {
              ...operationsData,
              operations: {
                ...operationsData.operations,
                someOpName: {
                  ...operationsData.operations.someOpName,
                  id: 'nonExistentOpId',
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
            parentTypeName: nonExistentRootTypeName,
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
          mockedOperationFile.recordings = {
            ...mockedOperationFile.recordings,
            someOpRecordingId: {
              ...mockedOperationFile.recordings.someOpRecordingId,
              rootTypeRecordings: {
                ...mockedOperationFile.recordings.someOpRecordingId
                  .rootTypeRecordings,
                xhg87iT1: {
                  ...mockedOperationFile.recordings.someOpRecordingId
                    .rootTypeRecordings.xhg87iT1,
                  recordingId: 'nonExistentRecordingId',
                },
              },
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
      xit('need to write these tests', () => {
        throw new Error('write these tests!!!');
      });
    });
  });
});
