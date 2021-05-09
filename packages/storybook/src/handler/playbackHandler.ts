import addons from '@storybook/addons';
import { EVENTS } from '../constants';
import { IntOp, Notification } from '../interfaces';

// TODO implement this
const resolveRecording = async (intOp: IntOp) => {
  return {
    data: null,
    errors: null,
  };
};

export const playbackHandler = async (req, res, ctx) => {
  if (req.body === undefined) {
    throw new Error('Request body is undefined but this is invalid!');
  }
  if (req.body.query === undefined) {
    throw new Error('Request does not include a query!');
  }

  const { getSchemaId, getWorkflowId } = require('./state');

  const workflowId = getWorkflowId();
  const schemaUrl = `${req.url.host}${req.url.pathname}`;
  const schemaId = getSchemaId(schemaUrl);

  let intOp: IntOp = {
    timestamp: Date.now(),
    schemaUrl: `${req.url.host}${req.url.pathname}`,
    workflowId: workflowId,
    query: req.body!.query,
    variables: req.body!.variables || {},
  };

  if (workflowId === null) {
    console.log('intOp', intOp);

    const channel = addons.getChannel();
    channel.emit(EVENTS.NEED_HELP_WITH_MOCK, intOp);

    const responseHelp = await new Promise<Notification>((resolve) =>
      channel.once(
        EVENTS.NEED_HELP_WITH_MOCK_RESPONSE,
        (data: Notification) => {
          console.log(
            'received EVENTS.NEED_HELP_WITH_MOCK_RESPONSE, data:',
            data
          );
          resolve(data);
        }
      )
    );

    console.log('responseHelp', responseHelp);
    // responseHelp.values.
  }

  const { data, errors } = await resolveRecording(intOp);

  // TODO find a way to respond errors and data in same response
  const response = errors
    ? ctx.errors(errors)
    : data
    ? ctx.data(data)
    : ctx.data(null);

  return res(response);
};
