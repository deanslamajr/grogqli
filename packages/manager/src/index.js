import http from 'http';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

let serverOptions;

export const startServer = (options = {}) => {
  serverOptions = options;
  const port = /*process.env.PORT || */4000;

  app.locals.saveDirectory = serverOptions.saveDirectory;

  server
    .listen(port, () => {
      console.log(`groqli-app serving traffic at localhost:${port}`);
    })
    .on('error', error => {
      console.log(error);
    });
}

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!!');

  // startServer();

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      app.locals.saveDirectory = serverOptions?.saveDirectory || '.';

      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}