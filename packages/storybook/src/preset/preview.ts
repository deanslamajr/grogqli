import { WithServiceWorkerUpdates } from '../withServiceWorkerUpdates';

export const decorators = [WithServiceWorkerUpdates];

const sw: { isInit: boolean } = {
  isInit: false,
};

const publicPathFromEnvVar = process.env.STORYBOOK_GROGQLI_PUBLIC_PATH;

export const loaders = [
  async ({ parameters }) => {
    if (sw.isInit === false) {
      const { startServiceWorker } = require('../handler');

      const publicPath =
        parameters?.grogqli?.publicPath || publicPathFromEnvVar;
      const schemaMappings = parameters?.grogqli?.schemaMappings;

      await startServiceWorker({
        publicPath,
        schemaMappings,
      });

      sw.isInit = true;
    }
  },
];
