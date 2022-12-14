import { StorageClient } from './StorageClient.mjs';

/** @group Plugins */

const storageModule = () => ({
  install(metaplex) {
    const storageClient = new StorageClient();

    metaplex.storage = () => storageClient;
  }

});

export { storageModule };
//# sourceMappingURL=plugin.mjs.map
