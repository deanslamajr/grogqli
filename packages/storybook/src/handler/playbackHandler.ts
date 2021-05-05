import addons from '@storybook/addons';
import { EVENTS } from '../constants';

// TODO implement this
const resolveRecording = async ({ query, variables, schemaId, workflowId }) => {
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

  if (workflowId === null) {
    const requestSubSet = {
      schemaUrl: `${req.url.host}${req.url.pathname}`,
      workflowId: workflowId,
      query: req.body!.query,
      variables: req.body!.variables || {},
    };

    const channel = addons.getChannel();
    channel.emit(EVENTS.NEED_HELP_WITH_MOCK, requestSubSet);

    await new Promise((resolve) =>
      channel.once(EVENTS.NEED_HELP_WITH_MOCK_RESPONSE, (data) => {
        console.log(
          'received EVENTS.NEED_HELP_WITH_MOCK_RESPONSE, data:',
          data
        );
        resolve(data);
      })
    );
    throw new Error(`
      Invalid handler state:
      workflowId === null
      
      Please set workflowId.
    `);
  }

  const { data, errors } = await resolveRecording({
    query: req.body.query,
    variables: req.body.variables || {},
    schemaId,
    workflowId,
  });

  // TODO find a way to respond errors and data in same response
  const response = errors
    ? ctx.errors(errors)
    : data
    ? ctx.data(data)
    : ctx.data(null);

  return res(response);
};
