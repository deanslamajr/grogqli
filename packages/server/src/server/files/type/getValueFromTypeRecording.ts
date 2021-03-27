import {
  GetValueFromTypeRecording,
  GetValuesInstanceId,
  HydratedVariables,
  VariablesRecording,
} from './types';

type HydrateRecordedVariables = (
  variables: VariablesRecording
) => Promise<HydratedVariables>;

const hydrateRecordedVariables: HydrateRecordedVariables = async (
  variables
) => {
  const hydratedVariables: HydratedVariables = {};
  const variableNames = Object.keys(variables);
  await Promise.all(
    variableNames.map(async (variableName) => {
      const hydratedVariableRecording = await hydrateRecordedVariable();
      hydratedVariables[variableName] = hydratedVariableRecording;
    })
  );
  return hydratedVariables;
};

const getValuesInstanceId: GetValuesInstanceId = async ({
  liveVariables,
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
      const doesMatch = compareVarsForMatch({
        recordedVariables: variablesHydratedFromRecording,
        liveVariables,
      });

      if (doesMatch) {
        matchedTypeRecordingValueId = typeRecordingValueId;
        break;
      }
    }
  }

  return matchedTypeRecordingValueId;
};

export const getValueFromTypeRecording: GetValueFromTypeRecording = async ({
  liveVariables,
  missStrategyFromClient,
  typeRecording,
  variablesRecordings,
}) => {
  const valuesInstanceId = getValuesInstanceId({
    liveVariables,
    missStrategyFromClient,
    typeRecording: typeRecording,
    variablesRecordings,
  });

  // miss!
  if (valuesInstanceId === null) {
    if (missStrategyFromClient === 'MATCH_OR_ERROR') {
      // return error
    }
    if (missStrategyFromClient === 'MATCH_OR_DEFAULT') {
      // return the value associated with the default typeRecordingValueId
    }
  }
  // match
  else {
    // return the value associated with the given typeRecordingValueId
  }
};
