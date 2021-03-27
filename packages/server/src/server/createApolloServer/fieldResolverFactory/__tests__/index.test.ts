import path from 'path';

import { fieldResolverFactory, ResolveValueFactoryParams } from '..';
import { Context } from '../..';
import { getConfig } from '../../../files/getConfig';
import {
  OperationRecordingsFile,
  OperationNameToIdMapping,
} from '../../../files/operation';
import { TypeNameToIdMappingVersion1 } from '../../../files/type';

import schema from './grogqli/schemas/o8eioU83f/schema.json';
import operationsData from './grogqli/schemas/o8eioU83f/operations.json';
import typeNameToIdMappingData from './grogqli/schemas/o8eioU83f/types.json';
import someOperationFile from './grogqli/operations/tRYadUuzxr.json';

jest.mock('../../../files/getConfig');
jest.mock('./grogqli/operations/tRYadUuzxr.json');

const workflowId = 'u33U7TWkJS';
const schemaId = 'o8eioU83f';
const opName = 'GetValues';
const opId = 'tRYadUuzxr';

describe('fieldResolverFactory', () => {
  let fieldResolverFactoryArgs: ResolveValueFactoryParams;
  let info: any;
  let context: Context;
  let mockedOperationFile: jest.Mocked<OperationRecordingsFile>;

  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      const relativePathToTestGrogqli = path.normalize('./grogqli');
      return path.join(__dirname, relativePathToTestGrogqli);
    });

    mockedOperationFile = (someOperationFile as OperationRecordingsFile) as jest.Mocked<OperationRecordingsFile>;
    const actualOperationFile = jest.requireActual(
      `./grogqli/operations/${opId}.json`
    );
    mockedOperationFile.recordings = actualOperationFile.recordings;

    fieldResolverFactoryArgs = {
      schema: schema.introspectionQuery as any,
      operationsData: operationsData as OperationNameToIdMapping,
      parentTypeName: schema.introspectionQuery.__schema.queryType.name,
      fieldName: 'inputThings',
      typeNameToIdMappingData: typeNameToIdMappingData as TypeNameToIdMappingVersion1,
    };

    info = {
      operation: {
        name: {
          value: opName,
        },
      },
    };

    context = {
      schemaId,
      runTimeVariables: {
        grogqli: { workflowId },
      },
    };
  });

  it('should return a resolver function', () => {
    const resolveField = fieldResolverFactory(fieldResolverFactoryArgs);

    expect(typeof resolveField).toBe('function');
  });

  describe('a resolver function created from a fieldResolverFactory invocation', () => {
    describe('if an unnamed operation is resolved', () => {
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

      describe('variables', () => {
        describe('resolving a field that does not have any associated args', () => {
          it('should correctly resolve the recording', async () => {
            throw new Error('Implement me!');
          });
        });

        describe('resolving a field that has associated arg(s)', () => {
          describe('for playback using MATCH_OR_ERROR strategy', () => {
            describe('if the given variables match a variable recording', () => {
              it.only('should resolve the recording associated with the matched variables recording', async () => {
                const args = {
                  input: {
                    type: 'MAC',
                  },
                };

                const resolveField = fieldResolverFactory(
                  fieldResolverFactoryArgs
                );

                const actual = await resolveField({}, args, context, info);

                expect(actual).toMatchSnapshot();
              });
            });

            describe('if the given variables DO NOT match a variable recording', () => {
              it('should throw an error', () => {
                throw new Error('Implement me!');
              });
            });

            describe('no variable recordings exist', () => {
              it('should throw an error', () => {
                throw new Error('Implement me!');
              });
            });
          });

          describe('for playback using MATCH_OR_DEFAULT strategy', () => {
            describe('if the given variables match a variable recording', () => {
              it('should resolve the recording associated with the matched variables recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('if the given variables DO NOT match a variable recording', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('no variable recordings exist', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });
          });

          describe('for playback using ALWAYS_DEFAULT strategy', () => {
            describe('if the given variables match a variable recording', () => {
              it('should resolve the recording associated with the matched variables recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('if the given variables DO NOT match a variable recording', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('no variable recordings exist', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });
          });
        });
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
            } as OperationNameToIdMapping,
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
      describe('variables', () => {
        describe('resolving a field that does not have any associated args', () => {
          it('should correctly resolve the recording', () => {
            throw new Error('Implement me!');
          });
        });

        describe('resolving a field that has associated arg(s)', () => {
          describe('for playback using MATCH_OR_ERROR strategy', () => {
            describe('if the given variables match a variable recording', () => {
              it('should resolve the recording associated with the matched variables recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('if the given variables DO NOT match a variable recording', () => {
              it('should throw an error', () => {
                throw new Error('Implement me!');
              });
            });

            describe('no variable recordings exist', () => {
              it('should throw an error', () => {
                throw new Error('Implement me!');
              });
            });
          });

          describe('for playback using MATCH_OR_DEFAULT strategy', () => {
            describe('if the given variables match a variable recording', () => {
              it('should resolve the recording associated with the matched variables recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('if the given variables DO NOT match a variable recording', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('no variable recordings exist', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });
          });

          describe('for playback using ALWAYS_DEFAULT strategy', () => {
            describe('if the given variables match a variable recording', () => {
              it('should resolve the recording associated with the matched variables recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('if the given variables DO NOT match a variable recording', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });

            describe('no variable recordings exist', () => {
              it('should resolve the default recording', () => {
                throw new Error('Implement me!');
              });
            });
          });
        });
      });
    });
  });
});
