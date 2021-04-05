export type VariablesToValuesIdMappings = Array<{
  variableRecordingId: string;
  typeRecordingValueId: string;
}> | null;

export interface TypeRecordingInstance {
  id: string;
  variables: VariablesToValuesIdMappings;
  default: string;
}

export interface TypeRecordingInstances {
  [recordingId: string]: TypeRecordingInstance;
}

type TypeRecordingValueDetail =
  | {
      type: 'reference';
      typeId: string;
      recordingId: string;
    }
  | {
      type: 'value';
      value: any;
    };

interface TypeRecordingValue {
  [fieldName: string]: TypeRecordingValueDetail;
}

interface TypeRecordingValues {
  [typeValueRecordingId: string]: TypeRecordingValue;
}

// pattern to support versioning this file structure
export type TypeRecordingsFile = TypeRecordingsFileVersion1;
export interface TypeRecordingsFileVersion1 {
  id: string;
  version: 1;
  recordings: TypeRecordingInstances;
  values: TypeRecordingValues;
  variables: VariablesRecordings;
}

export type MissStrategies =
  | 'MATCH_OR_ERROR'
  | 'MATCH_OR_DEFAULT'
  | 'ALWAYS_DEFAULT';

export type Args = { [argName: string]: any };

export type ResolveValueFromTypeRecording = (params: {
  missStrategyFromClient: MissStrategies;
  typeRecording: TypeRecordingInstance;
  args: Args;
  variablesRecordings: VariablesRecordings;
}) => Promise<any>;

export type MatchStrategyValue = 'SKIP' | 'EXACT';

export type VariableRecordingValue =
  | {
      type: 'reference';
      typeId: string;
      recordingId: string;
    }
  | {
      type: 'value';
      value: any;
      matchStrategy: MatchStrategyValue;
    };

export interface VariablesRecording {
  [argName: string]: VariableRecordingValue;
}

// export type HydratedVariable =
//   | {
//       fieldName: string;
//       isNested: true;
//       matchStrategy: MatchStrategy;
//       value: HydratedVariable;
//     }
//   | {
//       fieldName: string;
//       isNested: false;
//       matchStrategy: MatchStrategy;
//       value: any;
//     };

// export type HydratedVariables = Array<HydratedVariable>;
export type HydratedVariables<T extends { [key in keyof T]: any }> = {
  [U in keyof T]: T[U];
};

export type MatchStrategy<T> = T extends { [key: string]: any }
  ? 'SKIP' | { [U in keyof T]: MatchStrategy<T[U]> }
  : MatchStrategyValue;

export type HydratedMatchStrategies<T> = {
  [U in keyof T]: T[U] extends { [key: string]: any }
    ? MatchStrategy<T[U]>
    : MatchStrategyValue;
};

interface VariablesRecordings {
  [variableRecordingId: string]: VariablesRecording;
}

export type GetValuesInstanceId = (params: {
  args: Args;
  missStrategyFromClient: MissStrategies;
  typeRecording: TypeRecordingInstance;
  variablesRecordings: VariablesRecordings;
}) => Promise<string | null>;
