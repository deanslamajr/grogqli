import path from 'path';

import {
  getValuesInstanceId,
  hydrateRecordedVariable,
  hydrateRecordedVariables,
} from '../resolveValueFromTypeRecording';
import {
  Args,
  HydratedVariables,
  TypeRecordingInstance,
  VariablesRecording,
} from '../types';
import { getConfig } from '../../getConfig';

jest.mock('../../getConfig');

describe('resolveValueFromTypeRecording.ts', () => {
  beforeEach(() => {
    const mockedGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
    mockedGetConfig.mockImplementation(async () => () => {
      return path.join(__dirname, 'grogqli');
    });
  });

  describe('hydrateRecordedVariable', () => {
    describe('non-nested value', () => {
      it('should resolve value', () => {
        const expected = {
          value: 1234,
          matchStrategy: 'EXACT',
        };

        const actual = hydrateRecordedVariable({
          type: 'value',
          value: 1234,
          matchStrategy: 'EXACT',
        });

        expect(actual).toEqual(expected);
      });
    });
  });

  describe.only('hydrateRecordedVariables', () => {
    describe('a single arg', () => {
      it('should resolve the value of the variable recording', async () => {
        const variables: VariablesRecording = {
          someArg: {
            type: 'value',
            value: 1234,
            matchStrategy: 'EXACT',
          },
        };
        const actual = await hydrateRecordedVariables(variables);
        expect(actual).toEqual({
          variablesRecording: {
            someArg: 1234,
          },
          matchStrategies: {
            someArg: 'EXACT',
          },
        });
      });

      describe('nested variables', () => {
        xit('should resolve the value of the variable recording', async () => {});
      });
    });

    describe('multiple args', () => {
      it('should resolve the value of the variable recording', async () => {
        const variables: VariablesRecording = {
          someArg: {
            type: 'value',
            value: 1234,
            matchStrategy: 'EXACT',
          },
          anotherArg: {
            type: 'value',
            value: 'some string',
            matchStrategy: 'SKIP',
          },
        };
        const actual = await hydrateRecordedVariables(variables);
        expect(actual).toEqual({
          variablesRecording: {
            someArg: 1234,
            anotherArg: 'some string',
          },
          matchStrategies: {
            someArg: 'EXACT',
            anotherArg: 'SKIP',
          },
        });
      });

      describe('nested variables', () => {
        xit('should resolve the value of the variable recording', async () => {});
      });
    });
  });

  describe('getValuesInstanceId', () => {
    xit('should return the typeRecordingValueId associated with the first variable recording that returns a match', () => {});

    describe('if the given missStrategyFromClient is ALWAYS_DEFAULT', () => {
      it('should return the default value id', async () => {
        const defaultId = 'someDefaultId';
        const actual = await getValuesInstanceId({
          missStrategyFromClient: 'ALWAYS_DEFAULT',
          typeRecording: {
            default: defaultId,
          } as TypeRecordingInstance,
          args: {},
          variablesRecordings: {},
        });

        expect(actual).toBe(defaultId);
      });
    });

    describe('if the typeRecording does not have any associated recorded variables', () => {
      it('should return the default value id', async () => {
        const defaultId = 'someDefaultId';
        const actual = await getValuesInstanceId({
          missStrategyFromClient: 'MATCH_OR_ERROR',
          typeRecording: {
            variables: null,
            default: defaultId,
          } as TypeRecordingInstance,
          args: {},
          variablesRecordings: {},
        });

        expect(actual).toBe(defaultId);
      });
    });

    describe('if the typeRecording`s list of recorded variable ids are not associated with any variable recordings', () => {
      it('should return undefined', async () => {
        const actual = await getValuesInstanceId({
          missStrategyFromClient: 'MATCH_OR_ERROR',
          typeRecording: {
            variables: [
              {
                variableRecordingId: 'notARealVariableRecordingId',
                typeRecordingValueId: '',
              },
            ],
            default: 'defaultId',
          } as TypeRecordingInstance,
          args: {},
          variablesRecordings: {},
        });

        expect(actual).toBe(undefined);
      });
    });
  });
});
