import { fieldResolverFactory } from '../fieldResolverFactory';
import { Context, RecordingsPlan } from '../../index';

import schemaFile from './schema.json';

jest.mock('shortid', () => ({
  generate: () => 'mockRecordingId',
}));

describe('fieldResolverFactory', () => {
  describe('the function created from the factory', () => {
    let fieldResolver: ReturnType<typeof fieldResolverFactory>;
    const schema = schemaFile.introspectionQuery;
    const info = {};
    const operationResponseRecording =
      '{"data":{"search":{"artists":{"nodes":[{"id":"QXJ0aXN0OmJjNzEwYmNmLTg4MTUtNDJjZi1iYWQyLTNmMWQxMjI0NmFlYg==","name":"Nickelback","__typename":"Artist"},{"id":"QXJ0aXN0OjFkNmI5M2JhLTg1MWUtNDQ3Yy1iOTg3LThkMzA4ZDZhYzg5ZA==","name":"A Motown Tribute to Nickelback","__typename":"Artist"}],"__typename":"ArtistConnection"},"__typename":"SearchQuery"}}}';

    describe('resolving the field of a root type', () => {
      const queryTypeName = schema.__schema.queryType.name;
      const fieldName = 'search';

      beforeEach(() => {
        fieldResolver = fieldResolverFactory({
          schema,
          parentTypeName: queryTypeName,
          fieldName,
        });
      });

      it('should update the recording plan', async () => {
        const recordingsPlan: RecordingsPlan = {
          typeRecordings: {
            [queryTypeName]: {
              recordingId: 'someRecordingId',
              value: {},
            },
          },
        };

        const context: Context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              operationResponseRecording,
              recordingsPlan,
            },
          },
        };

        await fieldResolver({}, {}, context, info);

        expect(recordingsPlan).toMatchSnapshot();
      });

      it('should return data for child resolvers', async () => {
        const recordingsPlan: RecordingsPlan = {
          typeRecordings: {
            [queryTypeName]: {
              recordingId: 'someRecordingId',
              value: {},
            },
          },
        };

        const context: Context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              operationResponseRecording,
              recordingsPlan,
            },
          },
        };

        const response = await fieldResolver({}, {}, context, info);

        expect(response).toMatchSnapshot();
      });
    });

    describe('resolving the field of a nested type', () => {
      const queryTypeName = schema.__schema.queryType.name;
      const fieldName = 'artists';
      const parentTypeName = 'SearchQuery';

      const dataFromParentResolver = {
        artists: {
          __typename: 'ArtistConnection',
          nodes: [
            {
              __typename: 'Artist',
              id:
                'QXJ0aXN0OmJjNzEwYmNmLTg4MTUtNDJjZi1iYWQyLTNmMWQxMjI0NmFlYg==',
              name: 'Nickelback',
            },
            {
              __typename: 'Artist',
              id:
                'QXJ0aXN0OjFkNmI5M2JhLTg1MWUtNDQ3Yy1iOTg3LThkMzA4ZDZhYzg5ZA==',
              name: 'A Motown Tribute to Nickelback',
            },
          ],
        },
      };

      beforeEach(() => {
        fieldResolver = fieldResolverFactory({
          schema,
          parentTypeName,
          fieldName,
        });
      });

      it('should update the recording plan', async () => {
        const recordingsPlan: RecordingsPlan = {
          typeRecordings: {
            [queryTypeName]: {
              recordingId: 'someRecordingId',
              value: {
                search: 'anotherRecordingId',
              },
            },
            [parentTypeName]: {
              recordingId: 'anotherRecordingId',
              value: {},
            },
          },
        };

        const context: Context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              operationResponseRecording,
              recordingsPlan,
            },
          },
        };

        await fieldResolver(dataFromParentResolver, {}, context, info);

        expect(recordingsPlan).toMatchSnapshot();
      });

      it('should return data for child resolvers', async () => {
        const recordingsPlan: RecordingsPlan = {
          typeRecordings: {
            [queryTypeName]: {
              recordingId: 'someRecordingId',
              value: {
                search: 'anotherRecordingId',
              },
            },
            [parentTypeName]: {
              recordingId: 'anotherRecordingId',
              value: {},
            },
          },
        };

        const context: Context = {
          schemaId: schemaFile.id,
          runTimeVariables: {
            grogqli: {
              operationResponseRecording,
              recordingsPlan,
            },
          },
        };

        const response = await fieldResolver(
          dataFromParentResolver,
          {},
          context,
          info
        );

        expect(response).toMatchSnapshot();
      });
    });
  });
});
