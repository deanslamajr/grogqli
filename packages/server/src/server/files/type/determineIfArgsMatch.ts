import diff from 'deep-diff';
import getValue from 'get-value';

import { HydratedMatchStrategies, MatchStrategy } from './types';

type DetermineIfArgsMatch = <T>(params: {
  args: Partial<T>;
  variableRecordings: T;
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
