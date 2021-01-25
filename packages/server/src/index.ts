import http from 'http';

import { server, apolloServer } from './server';
import { grogqliPath } from './shared/constants';
import { getConfig } from './server/files/getConfig';

let httpServer: http.Server | undefined;
let httpTerminator;

const initializeServer = () => {
  apolloServer.applyMiddleware({ app: server, path: grogqliPath });
  httpServer = http.createServer(server);
  apolloServer.installSubscriptionHandlers(httpServer);
};

const registerServerForSafeTermination = () => {
  console.log('> Registering new server with http-terminator...');
  const { createHttpTerminator } = require('http-terminator');
  httpTerminator = createHttpTerminator({
    server: httpServer,
  });
};

const startServer = async () => {
  if (!httpServer) {
    throw new Error(
      'Attempted to start server but `httpServer` does not exist!'
    );
  }

  const config = await getConfig();
  const port = config('port');

  httpServer.listen(port, () => {
    console.log(`> Server started http://localhost:${port}`);
  });
};

initializeServer();

if (module.hot) {
  module.hot.accept('./server', async () => {
    console.log('🔁  HMR Reloading `./server`');

    console.log('> Temporarily stopping server...');
    await httpTerminator.terminate();

    initializeServer();
    registerServerForSafeTermination();
    startServer();
  });

  registerServerForSafeTermination();
  console.info('✅  Server-side HMR Enabled!');
}

startServer();

export default httpServer;
