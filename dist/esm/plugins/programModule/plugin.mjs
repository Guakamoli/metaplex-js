import { ProgramClient } from './ProgramClient.mjs';

/** @group Plugins */

const programModule = () => ({
  install(metaplex) {
    const programClient = new ProgramClient(metaplex);

    metaplex.programs = () => programClient;
  }

});

export { programModule };
//# sourceMappingURL=plugin.mjs.map
