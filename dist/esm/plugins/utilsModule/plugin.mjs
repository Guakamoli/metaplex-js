import { UtilsClient } from './UtilsClient.mjs';

/** @group Plugins */

const utilsModule = () => ({
  install(metaplex) {
    const utilsClient = new UtilsClient(metaplex);

    metaplex.utils = () => utilsClient;
  }

});

export { utilsModule };
//# sourceMappingURL=plugin.mjs.map
