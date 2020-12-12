import { IntrospectionOutputTypeRef } from 'graphql';
import shortid from 'shortid';

import { fieldResolverFactory } from '..';
import { Context, RecordingsPlan } from '../../../index';
import { generateRootTypeRecordingsIds } from '../../../../generateRecordingPlan';

import schemaFile from '../../../../__tests__/grogqli/schemas/anotherSchemaId/schema.json';

jest.mock('shortid', () => {
  let generateCounter = 0;

  return {
    generate: () => `mockRecordingId${generateCounter++}`,
    __resetCounter: () => {
      generateCounter = 0;
    },
  };
});

describe('fieldResolverFactory', () => {
  describe('creates a fieldResolver function', () => {
    let fieldResolver: ReturnType<typeof fieldResolverFactory>;
    let recordingsPlan: RecordingsPlan;
    let context: Context;

    const schema = schemaFile.introspectionQuery;
    const info = {};
    const parsedOpRecording = {
      data: {
        search: {
          artists: {
            nodes: [
              {
                id:
                  'QXJ0aXN0OmJjNzEwYmNmLTg4MTUtNDJjZi1iYWQyLTNmMWQxMjI0NmFlYg==',
                name: 'Nickelback',
                __typename: 'Artist',
              },
              {
                id:
                  'QXJ0aXN0OjFkNmI5M2JhLTg1MWUtNDQ3Yy1iOTg3LThkMzA4ZDZhYzg5ZA==',
                name: 'A Motown Tribute to Nickelback',
                __typename: 'Artist',
              },
            ],
            __typename: 'ArtistConnection',
          },
          __typename: 'SearchQuery',
        },
      },
    };

    describe('that can resolve a "root type" field of kind OBJECT', () => {
      // 'Query'
      const parentTypeName = schema.__schema.queryType.name;

      // 'search'
      const fieldName = Object.keys(parsedOpRecording.data)[0];

      const returnType: IntrospectionOutputTypeRef = {
        kind: 'OBJECT',
        name: parentTypeName,
      };

      beforeEach(() => {
        // @ts-ignore
        shortid.__resetCounter();

        fieldResolver = fieldResolverFactory({
          returnType,
          schema,
          parentTypeName,
          fieldName,
        });

        recordingsPlan = {
          typeRecordings: {},
        };

        context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              parsedOpRecording,
              recordingsPlan,
              rootTypeRecordingsIds: generateRootTypeRecordingsIds(),
            },
          },
        };
      });

      it('should update the recording plan correctly', async () => {
        await fieldResolver(undefined, {}, context, info);

        expect(recordingsPlan).toMatchSnapshot();
      });

      it('should return data for child resolvers', async () => {
        const response = await fieldResolver(undefined, {}, context, info);

        expect(response).toMatchSnapshot();
      });

      describe('parsedOpRecording.data === null', () => {
        it('should update the recording plan correctly', async () => {
          throw new Error('implement!');
          await fieldResolver(undefined, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          throw new Error('implement!');
          const response = await fieldResolver(undefined, {}, context, info);

          expect(response).toMatchSnapshot();
        });
      });

      describe('parsedOpRecording.data === undefined', () => {
        it('should update the recording plan correctly', async () => {
          throw new Error('implement!');
          await fieldResolver(undefined, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          throw new Error('implement!');
          const response = await fieldResolver(undefined, {}, context, info);

          expect(response).toMatchSnapshot();
        });
      });
    });

    describe('that can resolve a "nested type" field of kind OBJECT', () => {
      const parentTypeName = 'SearchQuery';

      // 'artists'
      const fieldName = Object.keys(parsedOpRecording.data.search)[0];

      const returnType: IntrospectionOutputTypeRef = {
        kind: 'OBJECT',
        name: 'ArtistConnection',
      };

      const parent = {
        parentTypeRecordingId: 'mockRecordingId0',
        value: parsedOpRecording.data.search,
      };

      beforeEach(() => {
        // @ts-ignore
        shortid.__resetCounter();

        fieldResolver = fieldResolverFactory({
          returnType,
          schema,
          parentTypeName,
          fieldName,
        });

        recordingsPlan = {
          typeRecordings: {},
        };

        context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              parsedOpRecording,
              recordingsPlan,
              rootTypeRecordingsIds: generateRootTypeRecordingsIds(),
            },
          },
        };
      });

      it('should update the recording plan correctly', async () => {
        await fieldResolver(parent, {}, context, info);

        expect(recordingsPlan).toMatchSnapshot();
      });

      it('should return data for child resolvers', async () => {
        const response = await fieldResolver(parent, {}, context, info);

        expect(response).toMatchSnapshot();
      });

      describe('parent.value[fieldName] === null', () => {
        it('should update the recording plan correctly', async () => {
          throw new Error('implement!');
          await fieldResolver(undefined, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          throw new Error('implement!');
          const response = await fieldResolver(undefined, {}, context, info);

          expect(response).toMatchSnapshot();
        });
      });

      describe('parent.value[fieldName] === undefined', () => {
        it('should update the recording plan correctly', async () => {
          throw new Error('implement!');
          await fieldResolver(undefined, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          throw new Error('implement!');
          const response = await fieldResolver(undefined, {}, context, info);

          expect(response).toMatchSnapshot();
        });
      });
    });

    describe('that can resolve a "nested type" field of kind LIST', () => {
      describe('ofType OBJECT', () => {
        const parentTypeName = 'ArtistConnection';
        const parentValue = parsedOpRecording.data.search.artists;

        // 'nodes'
        const fieldName = Object.keys(parentValue)[0];

        const returnType: IntrospectionOutputTypeRef = {
          kind: 'LIST',
          ofType: {
            kind: 'OBJECT',
            name: 'Artist',
          },
        };

        const parent = {
          parentTypeRecordingId: 'mockRecordingId0',
          value: parentValue,
        };

        beforeEach(() => {
          // @ts-ignore
          shortid.__resetCounter();

          fieldResolver = fieldResolverFactory({
            returnType,
            schema,
            parentTypeName,
            fieldName,
          });

          recordingsPlan = {
            typeRecordings: {},
          };

          context = {
            schemaId: schemaFile.id,
            runTimeVariables: {
              grogqli: {
                parsedOpRecording,
                recordingsPlan,
                rootTypeRecordingsIds: generateRootTypeRecordingsIds(),
              },
            },
          };
        });

        it('should update the recording plan correctly', async () => {
          await fieldResolver(parent, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          const response = await fieldResolver(parent, {}, context, info);

          expect(response).toMatchSnapshot();
        });

        describe('parent.value[fieldName] === null', () => {
          it('should update the recording plan correctly', async () => {
            throw new Error('implement!');
            await fieldResolver(undefined, {}, context, info);

            expect(recordingsPlan).toMatchSnapshot();
          });

          it('should return data for child resolvers', async () => {
            throw new Error('implement!');
            const response = await fieldResolver(undefined, {}, context, info);

            expect(response).toMatchSnapshot();
          });
        });

        describe('parent.value[fieldName] === undefined', () => {
          it('should update the recording plan correctly', async () => {
            throw new Error('implement!');
            await fieldResolver(undefined, {}, context, info);

            expect(recordingsPlan).toMatchSnapshot();
          });

          it('should return data for child resolvers', async () => {
            throw new Error('implement!');
            const response = await fieldResolver(undefined, {}, context, info);

            expect(response).toMatchSnapshot();
          });
        });
      });
    });

    describe('that can resolve a "nested type" field of kind SCALAR', () => {
      const parentTypeName = 'Artist';
      const parentValue = parsedOpRecording.data.search.artists.nodes[0];

      // 'name'
      const fieldName = Object.keys(parentValue)[0];

      const returnType: IntrospectionOutputTypeRef = {
        kind: 'SCALAR',
        name: 'name',
      };

      const parent = {
        parentTypeRecordingId: 'mockRecordingId0',
        value: parentValue,
      };

      beforeEach(() => {
        // @ts-ignore
        shortid.__resetCounter();

        fieldResolver = fieldResolverFactory({
          returnType,
          schema,
          parentTypeName,
          fieldName,
        });

        recordingsPlan = {
          typeRecordings: {},
        };

        context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              parsedOpRecording,
              recordingsPlan,
              rootTypeRecordingsIds: generateRootTypeRecordingsIds(),
            },
          },
        };
      });

      it('should update the recording plan correctly', async () => {
        await fieldResolver(parent, {}, context, info);

        expect(recordingsPlan).toMatchSnapshot();
      });

      it('should return data for child resolvers', async () => {
        const response = await fieldResolver(parent, {}, context, info);

        expect(response).toMatchSnapshot();
      });

      describe('parent.value[fieldName] === null', () => {
        it('should update the recording plan correctly', async () => {
          throw new Error('implement!');
          await fieldResolver(undefined, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          throw new Error('implement!');
          const response = await fieldResolver(undefined, {}, context, info);

          expect(response).toMatchSnapshot();
        });
      });

      describe('parent.value[fieldName] === undefined', () => {
        it('should update the recording plan correctly', async () => {
          throw new Error('implement!');
          await fieldResolver(undefined, {}, context, info);

          expect(recordingsPlan).toMatchSnapshot();
        });

        it('should return data for child resolvers', async () => {
          throw new Error('implement!');
          const response = await fieldResolver(undefined, {}, context, info);

          expect(response).toMatchSnapshot();
        });
      });
    });
  });
});
