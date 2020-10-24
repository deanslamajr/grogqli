import http from 'http';

import { server, apolloServer } from './server';
import { grogqliPath } from './shared/constants';

let httpServer: http.Server | undefined;
let httpTerminator;

const port = 4000; //process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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

const startServer = () => {
  if (!httpServer) {
    throw new Error(
      'Attempted to start server but `httpServer` does not exist!'
    );
  }
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
