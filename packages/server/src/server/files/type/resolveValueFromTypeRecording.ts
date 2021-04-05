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
) => Promise<HydratedVariables>;

export const hydrateRecordedVariables: HydrateRecordedVariables = async (
  variables
) => {
  const hydratedVariables: HydratedVariables = {};
  await Promise.all(
    Object.entries(variables).map(async ([argName, recordedValue]) => {
      const hydratedVariableRecording = await hydrateRecordedVariable(
        recordedValue
      );
      hydratedVariables[argName] = hydratedVariableRecording;
    })
  );
  return hydratedVariables;
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

  let matchedTypeRecordingValueId: string | undefined;

  for (const {
    variableRecordingId,
    typeRecordingValueId,
  } of typeRecording.variables) {
    const variablesRecording: VariablesRecording | undefined =
      variablesRecordings[variableRecordingId];

    if (variablesRecording !== undefined) {
      const variablesHydratedFromRecording = await hydrateRecordedVariables(
        variablesRecording
      );
      const doArgsMatch = determineIfArgsMatch({
        variableRecordings: variablesHydratedFromRecording,
        args,
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
