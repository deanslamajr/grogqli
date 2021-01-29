import { Handler, HandlerState } from '@grogqli/schema';
import editJsonFile from 'edit-json-file';
import shortid from 'shortid';

import {
  doesFileExist,
  getSessionsFilePath,
  HANDLER_SESSIONS_STATE_FILE_VERSION,
  mapObjectToJsonFile,
} from './';

type HandlerSession = Omit<Handler, '__typename'>;

export type HandlerSessionStateFile = HandlerSessionStateFileVersion1;
interface HandlerSessionStateFileVersion1 {
  version: 1;
  sessions: { [sessionId: string]: HandlerSession };
}

export const create = async (name: string): Promise<Handler> => {
  const newHandler: Handler = {
    id: shortid.generate(),
    name,
    currentState: HandlerState.Recording,
  };

  const pathToSessionsFile = await getSessionsFilePath();
  const handlerSessionStateFile = editJsonFile(pathToSessionsFile);

  if (doesFileExist(handlerSessionStateFile)) {
    handlerSessionStateFile.set(`sessions.${newHandler.id}`, newHandler);
  } else {
    const newSessionStateFileContents: HandlerSessionStateFileVersion1 = {
      version: HANDLER_SESSIONS_STATE_FILE_VERSION,
      sessions: {
        [newHandler.id]: newHandler,
      },
    };
    mapObjectToJsonFile(newSessionStateFileContents, handlerSessionStateFile);
  }

  handlerSessionStateFile.save();

  return newHandler;
};

const getById = async (sessionId: string): Promise<Handler> => {
  // TODO implement this
  return {
    id: sessionId,
    name:
      'mocked session handler data this is a really long title for a session',
    currentState: HandlerState.Recording,
  };
};

export const getByIds = async (sessionIds: string[]): Promise<Handler[]> => {
  const mockSessionIds = ['abcdefg', '12345678', 'lkjsdf86c'];
  return Promise.all(mockSessionIds.map((sessionId) => getById(sessionId)));
};
