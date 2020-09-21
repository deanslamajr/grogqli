const CONFIG_FILE_NAME = 'grogqli.json';

interface GrogqliConfig {
  recordingsSaveDirectory: string;
  recordingsFilename: string;
}

const DEFAULT_CONFIG: GrogqliConfig = {
  recordingsSaveDirectory: '/home/dhan/codes/grogqli',
  recordingsFilename: 'groql_rec'
};
export const getConfig = (): GrogqliConfig => {
  // TODO
  // recursively try to open a file with filename === CONFIG_FILE_NAME
  // if file doesn't exist, try again in parent directory
  // if file isn't found at root directory, return DEFAULT_CONFIG

  // TODO
  // if a config doesn't have a value defined for a particular lookup
  // use the value found in DEFAULT_CONFIG
  return DEFAULT_CONFIG;
}