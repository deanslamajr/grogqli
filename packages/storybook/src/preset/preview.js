import { withServiceWorkerUpdates } from '../withServiceWorkerUpdates';

export const decorators = [withServiceWorkerUpdates];

const sw = {
  isInit: false
};

export const loaders = [
  async () => {
    if (sw.isInit === false) {
      const { startServiceWorker } = require('../handler');

      // TODO make the Grogqli Addon consumer provide this
      const schemaMappings = {
        'someUrl.com/graphql': 'someSchemaId'
      }

      await startServiceWorker({
        schemaMappings
      });

      sw.isInit = true;
    }
  },
];