import diff from 'deep-diff';
import getValue from 'get-value';

import {
  HydratedVariables,
  HydratedMatchStrategies,
  MatchStrategy,
} from './types';

// type PruneSkippedArgs = (params: {
//   args: Args;
//   variableRecordings: HydratedVariables;
//   matchStrategies: HydratedMatchStrategies;
// }) => {
//   argsWithoutSkips: Args;
//   variableRecordingsWithoutSkips: HydratedVariables;
// };

// const pruneSkippedArgs: PruneSkippedArgs = ({
//   args,
//   variableRecordings,
//   matchStrategies,
// }) => {
//   const argsWithoutSkips: Args = {};
//   const variableRecordingsWithoutSkips: HydratedVariables = {};

//   Object.entries(matchStrategies).forEach(([argName, matchStrategy]) => {
//     if (matchStrategy !== 'SKIP') {
//       argsWithoutSkips[argName] = args[argName];
//       variableRecordingsWithoutSkips[argName] = variableRecordings[argName];
//     }
//   });

//   return {
//     argsWithoutSkips,
//     variableRecordingsWithoutSkips,
//   };
// };

type DetermineIfArgsMatch = <T>(params: {
  args: T;
  variableRecordings: HydratedVariables<Partial<T>>;
  matchStrategies: HydratedMatchStrategies<T>;
}) => boolean;

export const determineIfArgsMatch: DetermineIfArgsMatch = ({
  args,
  matchStrategies,
  variableRecordings,
}) => {
  const result = diff.diff(variableRecordings, args);

  if (result === undefined) {
    return true;
  }

  const hasAMiss = result.some((diff) => {
    if (diff.path !== undefined) {
      const fixedPathTokens: string[] = diff.path.map((pathToken) => {
        // match strategies for arrays only have a single element
        if (typeof pathToken === 'number') {
          return pathToken.toString();
        }
        return pathToken;
      });

      const matchStrategyForMiss: MatchStrategy<typeof args> = getValue(
        matchStrategies,
        fixedPathTokens
      );

      if (matchStrategyForMiss === 'EXACT') {
        return true;
      }
      if (matchStrategyForMiss === undefined) {
        // TODO handle case where a given arg
        // does not exist in the recorded variable
        // Allow the client to set how this is handled
        // e.g. some workflows might want to be more strict
        // about this case than others
      }
    }

    return false;
  });

  return !hasAMiss;
};

// Previous solution: aka hand-built solution
// this is a tricky alg to build, avoid building from scratch if possible
//
// type DoesArgMiss = (params: {
//   argValue: string;
//   recordedValue: HydratedVariable;
// }) => boolean;
// const doesArgMiss: DoesArgMiss = ({ argValue, recordedValue }) => {
//   if (recordedValue.matchStrategy === 'SKIP') {
//     return false;
//   }

//   if (recordedValue.isNested) {
//     return doesArgMiss();
//   }
//   return !(argValue === recordedValue.value);
// };
//
// type DetermineIfArgsMatch = (params: {
//   variableRecordings: HydratedVariables;
//   args: Args;
// }) => boolean;

// export const determineIfArgsMatch: DetermineIfArgsMatch = ({
//   variableRecordings,
//   args,
// }) => {
//   return !variableRecordings.some(
//     ({fieldName, matchStrategy, isNested, value}) => {
//     // ([argName, recordedValue]) => {
//       // doesArgMiss({ recordedValue, argValue: args[argName] })
//       if (matchStrategy === 'SKIP') {
//         return false;
//       }

//       if (isNested) {
//         const nestedRecordedVars = {};
//         const nestedArgs = {};

//         Object.keys(value).forEach((nestedFieldName) => {
//           nestedRecordedVars[nestedFieldName] = value[nestedFieldName];
//         });

//         Object.keys(args[fieldName]).forEach((nestedFieldName) => {
//           nestedArgs[nestedFieldName] = args[fieldName][nestedFieldName];
//         });

//         return determineIfArgsMatch({
//           variableRecordings: nestedRecordedVars,
//           args: nestedArgs,
//         });
//       }
//       return !(args[argName] === recordedValue.value);
//     }
//   );
// };
