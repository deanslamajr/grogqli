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
  id: string;
  name: string;
  currentState: HandlerState;
  workflowId: string | null;
};

export interface UpdateParameters {
  sessionId: string;
  name?: HandlerSessionStateFile['name'];
  currentState?: HandlerSessionStateFile['currentState'];
  workflowId?: NonNullable<HandlerSessionStateFile['workflowId']>;
}
type Update = (params: UpdateParameters) => Promise<HandlerSessionStateFile>;
export const update: Update = async ({
  sessionId,
  name,
  currentState,
  workflowId,
}) => {
  const pathToSessionStateFile = await getSessionsFilePath(sessionId);
  const handlerSessionStateFile = editJsonFile(pathToSessionStateFile);

  if (doesFileExist(handlerSessionStateFile)) {
    if (name) {
      handlerSessionStateFile.set('name', name);
    }
    if (currentState) {
      handlerSessionStateFile.set('currentState', currentState);
    }
    if (workflowId) {
      handlerSessionStateFile.set('workflowId', workflowId);
    }
  } else {
    // can't find a file for sessionId
    // TODO handle this more gracefully e.g. just create a new session?
    throw new Error(
      `Update session error: can't find a session file associated with session id:${sessionId}`
    );
  }

  handlerSessionStateFile.save();

  const newHandler = handlerSessionStateFile.toObject() as HandlerSessionStateFile;

  return newHandler;
};

export const create = async (name: string): Promise<Handler> => {
  const newHandler: Handler = {
    id: shortid.generate(),
    name,
    currentState: HandlerState.Recording,
    workflowId: null,
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
    const newSessionStateFileContents: HandlerSessionStateFile = {
      version: HANDLER_SESSIONS_STATE_FILE_VERSION,
      id: newHandler.id,
      name: newHandler.name,
      currentState: newHandler.currentState,
      workflowId: newHandler.workflowId,
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
    workflowId: sessionStateFile.workflowId,
  };
};

export const getByIds = async (sessionIds: string[]): Promise<Handler[]> => {
  return Promise.all(sessionIds.map((sessionId) => getById(sessionId)));
};
