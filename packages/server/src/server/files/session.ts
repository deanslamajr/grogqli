import { Handler, HandlerState } from '@grogqli/schema';
import editJsonFile from 'edit-json-file';
import shortid from 'shortid';
import fs from 'fs';

import {
  doesFileExist,
  getSessionsFilePath,
  HANDLER_SESSIONS_STATE_FILE_VERSION,
  mapObjectToJsonFile,
} from './';

export type HandlerSessionStateFile = HandlerSessionStateFileVersion1;
type HandlerSessionStateFileVersion1 = {
  version: 1;
} & Pick<Handler, 'id' | 'name' | 'currentState'>;

export const create = async (name: string): Promise<Handler> => {
  const newHandler: Handler = {
    id: shortid.generate(),
    name,
    currentState: HandlerState.Recording,
  };

  const pathToSessionStateFile = await getSessionsFilePath(newHandler.id);
  const handlerSessionStateFile = editJsonFile(pathToSessionStateFile);

  if (doesFileExist(handlerSessionStateFile)) {
    // file should not already exist
    // if it does, this probably means that the generated id is
    // already in use as an id for another session
    throw new Error(
      `The generated session id:${newHandler.id} seems to already be in use!`
    );
  } else {
    const newSessionStateFileContents: HandlerSessionStateFileVersion1 = {
      version: HANDLER_SESSIONS_STATE_FILE_VERSION,
      id: newHandler.id,
      name: newHandler.name,
      currentState: newHandler.currentState,
    };
    mapObjectToJsonFile(newSessionStateFileContents, handlerSessionStateFile);
  }

  handlerSessionStateFile.save();

  return newHandler;
};

type GetSessionStateFromDisk = (
  sessionId: string
) => Promise<HandlerSessionStateFile>;

export const getSessionStateFromDisk: GetSessionStateFromDisk = async (
  sessionId
) => {
  const pathToSessionStateFile = await getSessionsFilePath(sessionId);

  let sessionStateFile: HandlerSessionStateFile;
  try {
    sessionStateFile = JSON.parse(
      await fs.promises.readFile(pathToSessionStateFile, 'utf8')
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error while attempting to open handler session state file associated with sessionId:${sessionId}
       This probably means a file does not exist for the given id.`
    );
  }

  return sessionStateFile;
};

const getById = async (sessionId: string): Promise<Handler> => {
  const sessionStateFile = await getSessionStateFromDisk(sessionId);
  return {
    id: sessionStateFile.id,
    name: sessionStateFile.name,
    currentState: sessionStateFile.currentState,
  };
};

export const getByIds = async (sessionIds: string[]): Promise<Handler[]> => {
  return Promise.all(sessionIds.map((sessionId) => getById(sessionId)));
};
