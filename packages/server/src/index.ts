// import express from 'express';
import http from 'http';

let app = require('./server').default;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`');
    try {
      app = require('./server').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = 4000;//process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// export default express()
//   .use((req, res) => app.handle(req, res))
//   .listen(port, () => {
//     console.log(`> App started http://localhost:${port}`)
//   });

app.apolloServer.applyMiddleware({ app: app.server, path: '/grogqli' });

const httpServer = http.createServer(app.server);

app.apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
    console.log(`> App started http://localhost:${port}`)
  });

export default httpServer;