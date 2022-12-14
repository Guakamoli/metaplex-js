import { RpcClient } from './RpcClient.mjs';

/** @group Plugins */

const rpcModule = () => ({
  install(metaplex) {
    const rpcClient = new RpcClient(metaplex);

    metaplex.rpc = () => rpcClient;
  }

});

export { rpcModule };
//# sourceMappingURL=plugin.mjs.map
