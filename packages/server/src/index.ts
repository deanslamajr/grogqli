import http from 'http';

import { server, apolloServer } from './server';
import { grogqliPath } from './shared/constants';

let httpServer;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`');
    apolloServer.applyMiddleware({ app: server, path: '/grogqli' });
    httpServer = http.createServer(server);
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(port, () => {
      console.log(`> App started http://localhost:${port}`);
    });
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = 4000; //process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

apolloServer.applyMiddleware({ app: server, path: grogqliPath });
httpServer = http.createServer(server);
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen(port, () => {
  console.log(`> App started http://localhost:${port}`);
});

export default httpServer;
