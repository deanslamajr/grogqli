import { PlaybackRecording } from '@grogqli/schema';

import { get as getApolloClient } from '../../apolloClient';
import { DoWork, wrapWithBaseHandler } from '../baseHandler';
import { getWorkflowId } from '../../handlerState';

const { PlaybackRecordingDocument } = PlaybackRecording;

const playbackOperation: DoWork = async (req, _res, _ctx) => {
  const apolloClient = getApolloClient();

  const workflowId = getWorkflowId();

  if (workflowId === null) {
    throw new Error(`
      Invalid session handler state:
      Cannot have a null workflowId while in PLAYBACK mode. 
    `);
  }

  const { data, errors } = await apolloClient.mutate({
    mutation: PlaybackRecordingDocument,
    variables: {
      input: {
        schemaUrl: `${req.url.host}${req.url.pathname}`,
        workflowId: workflowId,
        query: req.body!.query,
        variables: req.body!.variables || {},
      },
    },
  });

  if (errors && errors.length) {
    errors.forEach((error) => console.error(error));
  }

  let dataFromPlayback = null;
  let errorsFromPlayback = null;
  if (data?.playbackRecording) {
    dataFromPlayback =
      data.playbackRecording.data !== null ? data.playbackRecording.data : null;
    errorsFromPlayback =
      data.playbackRecording.errors !== null
        ? data.playbackRecording.errors
        : null;
  }

  return {
    data: dataFromPlayback,
    errors: errorsFromPlayback,
  };
};

const playbackHandler = wrapWithBaseHandler(playbackOperation);
export default playbackHandler;
