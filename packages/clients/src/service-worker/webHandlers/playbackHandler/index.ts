import { PlaybackRecording } from '@grogqli/schema';

import { get as getApolloClient } from '../../apolloClient';
import { DoWork, wrapWithBaseHandler } from '../baseHandler';

const { PlaybackRecordingDocument } = PlaybackRecording;

const playbackOperation: DoWork = async (req, _res, _ctx) => {
  const apolloClient = getApolloClient();

  const { data, errors } = await apolloClient.mutate({
    mutation: PlaybackRecordingDocument,
    variables: {
      input: {
        schemaId: 'test',
        workflowId: 'ITD_Tk6hwo7',
        query: req.body!.query,
        variables: req.body!.variables
          ? JSON.stringify(req.body!.variables)
          : null,
      },
    },
  });

  if (errors && errors.length) {
    errors.forEach(error => console.error(error));
  }

  let dataFromPlayback;
  let errorsFromPlayback;
  if (data?.playbackRecording) {
    dataFromPlayback =
      data.playbackRecording.data !== null
        ? JSON.parse(data.playbackRecording.data)
        : null;
    errorsFromPlayback =
      data.playbackRecording.errors !== null
        ? JSON.parse(data.playbackRecording.errors)
        : null;
  }

  return {
    data: dataFromPlayback,
    errors: errorsFromPlayback,
  };
};

const playbackHandler = wrapWithBaseHandler(playbackOperation);
export default playbackHandler;
