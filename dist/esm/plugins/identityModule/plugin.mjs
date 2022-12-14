import { IdentityClient } from './IdentityClient.mjs';

/** @group Plugins */

const identityModule = () => ({
  install(metaplex) {
    const identityClient = new IdentityClient();

    metaplex.identity = () => identityClient;
  }

});

export { identityModule };
//# sourceMappingURL=plugin.mjs.map
