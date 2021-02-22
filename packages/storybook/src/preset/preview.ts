import { WithServiceWorkerUpdates } from '../withServiceWorkerUpdates';

export const decorators = [WithServiceWorkerUpdates];

const sw: { isInit: boolean } = {
  isInit: false,
};

export const loaders = [
  async () => {
    if (sw.isInit === false) {
      const { startServiceWorker } = require('../handler');

      // TODO make the Grogqli Addon consumer provide this
      const schemaMappings = {
        'someUrl.com/graphql': 'someSchemaId',
      };

      await startServiceWorker({
        schemaMappings,
      });

      sw.isInit = true;
    }
  },
];
