import diff from 'deep-diff';
import getValue from 'get-value';

import {
  Args,
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

type DetermineIfArgsMatch = (params: {
  args: Args;
  variableRecordings: HydratedVariables;
  matchStrategies: HydratedMatchStrategies;
}) => boolean;

export const determineIfArgsMatch: DetermineIfArgsMatch = ({
  args,
  matchStrategies,
  variableRecordings,
}) => {
  // before performing any diff work,
  // remove any parts of the variables that have SKIP strategies
  // why do this?
  // 1. it allows for a simpler diff alg that correctly SKIPs args that exist
  // 2. prevents wasted diff work
  // const { argsWithoutSkips, variableRecordingsWithoutSkips } = pruneSkippedArgs(
  //   {
  //     args,
  //     matchStrategies,
  //     variableRecordings,
  //   }
  // );

  // const result = diff.diff(variableRecordingsWithoutSkips, argsWithoutSkips);

  // TODO sort both before computing diff
  const result = diff.orderIndependentDiff(variableRecordings, args);
  console.log('result', result);

  if (result === undefined) {
    return true;
  }

  const hasAMiss = result.some((diff) => {
    console.log('diff.path', diff.path);

    if (diff.kind !== 'A') {
      if (diff.path !== undefined) {
        const fixedPathTokens: string[] = diff.path.map((pathToken) => {
          // match strategies for arrays only have a single element
          if (typeof pathToken === 'number') {
            return '0';
          }
          return pathToken;
        });
        // const pathAsString = fixedPath.join('.');
        const matchStrategyForMiss: MatchStrategy = getValue(
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
          console.log(
            'TODO handle case where no match strategy found. fixedPathTokens',
            fixedPathTokens
          );
        }
      }
    } else {
      // TODO handle array case
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
