import path from 'path';
import findUp from 'find-up';
import editJsonFile from 'edit-json-file';

const CONFIG_FILE_NAME = 'grogqli.json';

export interface GrogqliConfig {
  recordingsSaveDirectory: string;
  recordingsFilename: string;
}

const DEFAULT_CONFIG: GrogqliConfig = {
  recordingsSaveDirectory: path.join(process.cwd(), 'grogqli'),
  recordingsFilename: 'groql_rec',
};

let getGrogqliConfigValue: GetGrogqliConfigValue | undefined;

type GetGrogqliConfigValue = (configKey: keyof GrogqliConfig) => string;
export const getConfig = async (): Promise<GetGrogqliConfigValue> => {
  // return early if the response is cached
  if (getGrogqliConfigValue) {
    return getGrogqliConfigValue;
  }

  // recursively try to open a file with filename === CONFIG_FILE_NAME
  // if file doesn't exist, try again in parent directory
  // if file isn't found at root directory, return DEFAULT_CONFIG
  const configLocation = await findUp(
    async (directory) => {
      const hasConfig = await findUp.exists(
        path.join(directory, CONFIG_FILE_NAME)
      );
      return hasConfig ? directory : undefined;
    },
    { type: 'directory' }
  );

  let configFromFile: editJsonFile.JsonEditor;

  if (configLocation) {
    const configFileAbsolutePath = path.join(configLocation, CONFIG_FILE_NAME);
    configFromFile = editJsonFile(configFileAbsolutePath);
  }

  getGrogqliConfigValue = (configKey: string) => {
    if (configKey === undefined) {
      throw new Error(
        'Invalid use of getGrogqliConfigValue: must provide a key'
      );
    }
    let configValue: any;
    if (configLocation && configFromFile) {
      configValue = configFromFile.get(configKey);
      if (
        configKey === 'recordingsSaveDirectory' &&
        configValue !== undefined
      ) {
        configValue = path.join(configLocation, configValue);
      }
    }
    if (configValue === undefined) {
      configValue = DEFAULT_CONFIG[configKey];
    }
    return configValue;
  };

  return getGrogqliConfigValue;
};
