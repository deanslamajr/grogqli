import path from 'path';

import { generateRecordingPlan } from '../generateRecordingPlan';
import { getConfig } from '../../files/getConfig';

jest.mock('../../files/getConfig');
jest.mock('shortid', () => {
  let generateCounter = 0;

  return {
    generate: () => `mockRecordingId${generateCounter++}`,
  };
});

describe('generateRecordingPlan', () => {
  const schemaId = 'anotherSchemaId';
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
  const operationSDL =
    'query SearchForArtist {\n  search {\n    artists(query: "nickelback") {\n      nodes {\n        id\n        name\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n';
  const variables = {};

  beforeAll(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'grogqli');
    });
  });

  it('should return a recording plan', async () => {
    const actual = await generateRecordingPlan({
      parsedOpRecording,
      operationSDL,
      schemaId,
      variables,
    });

    expect(actual).toMatchSnapshot();
  });
});
