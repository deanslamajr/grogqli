import {
  ResolveValueFromTypeRecording,
  GetValuesInstanceId,
  HydratedVariables,
  VariableRecordingValue,
  VariablesRecording,
  Args,
  HydratedVariable,
} from './types';
import { determineIfArgsMatch } from './determineIfArgsMatch';

export const hydrateRecordedVariable = (
  recordedValue: VariableRecordingValue
): any => {
  if (recordedValue.type === 'value') {
    return {
      value: recordedValue.value,
      matchStrategy: recordedValue.matchStrategy,
    };
  }
};

type HydrateRecordedVariables = (
  variables: VariablesRecording
) => Promise<{
  variablesRecording: object;
  matchStrategies: object;
}>;

export const hydrateRecordedVariables: HydrateRecordedVariables = async (
  variables
) => {
  const variablesRecording: object = {};
  const matchStrategies: object = {};

  await Promise.all(
    Object.entries(variables).map(async ([argName, recordedValue]) => {
      const { value, matchStrategy } = await hydrateRecordedVariable(
        recordedValue
      );
      variablesRecording[argName] = value;
      matchStrategies[argName] = matchStrategy;
    })
  );

  return { variablesRecording, matchStrategies };
};

export const getValuesInstanceId: GetValuesInstanceId = async ({
  args,
  missStrategyFromClient,
  typeRecording,
  variablesRecordings,
}) => {
  if (missStrategyFromClient === 'ALWAYS_DEFAULT') {
    return typeRecording.default;
  }
  if (typeRecording.variables === null) {
    return typeRecording.default;
  }

  let matchedTypeRecordingValueId: string | null = null;

  for (const {
    variableRecordingId,
    typeRecordingValueId,
  } of typeRecording.variables) {
    const variablesRecording: VariablesRecording | undefined =
      variablesRecordings[variableRecordingId];

    if (variablesRecording !== undefined) {
      // TODO cache hydration work so that it is not repeated too frequently
      const {
        variablesRecording: hydratedVariablesRecording,
        matchStrategies,
      } = await hydrateRecordedVariables(variablesRecording);

      const doArgsMatch = determineIfArgsMatch({
        args,
        variableRecordings: hydratedVariablesRecording,
        matchStrategies: matchStrategies,
      });

      if (doArgsMatch) {
        matchedTypeRecordingValueId = typeRecordingValueId;
        break;
      }
    }
  }

  return matchedTypeRecordingValueId;
};

export const resolveValueFromTypeRecording: ResolveValueFromTypeRecording = async ({
  args,
  missStrategyFromClient,
  typeRecording,
  variablesRecordings,
}) => {
  const valuesInstanceId = getValuesInstanceId({
    args,
    missStrategyFromClient,
    typeRecording,
    variablesRecordings,
  });

  // miss!
  if (valuesInstanceId === null) {
    if (missStrategyFromClient === 'MATCH_OR_ERROR') {
      // return error
    }
    if (missStrategyFromClient === 'MATCH_OR_DEFAULT') {
      // return the value associated with typeRecording.default
    }
  }
  // match
  else {
    // return the value associated with valuesInstanceId
  }
};
