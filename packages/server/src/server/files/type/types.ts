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

interface TypeRecordingValue {
  [fieldName: string]: RecordingValue;
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

export type LiveVariables = any;

export type GetValueFromTypeRecording = (params: {
  missStrategyFromClient: MissStrategies;
  typeRecording: TypeRecordingInstance;
  liveVariables: LiveVariables;
  variablesRecordings: VariablesRecordings;
}) => Promise<any>;

type RecordingValue =
  | {
      type: 'reference';
      typeId: string;
      recordingId: string;
    }
  | {
      type: 'value';
      value: any;
    };

export interface VariablesRecording {
  [argName: string]: RecordingValue;
}

export interface HydratedVariables {
  [argName: string]: any;
}

interface VariablesRecordings {
  [variableRecordingId: string]: VariablesRecording;
}

export type GetValuesInstanceId = (params: {
  liveVariables: LiveVariables;
  missStrategyFromClient: MissStrategies;
  typeRecording: TypeRecordingInstance;
  variablesRecordings: VariablesRecordings;
}) => Promise<string | null>;
