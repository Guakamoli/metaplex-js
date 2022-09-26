"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachinesClient = void 0;
const types_1 = require("../../types");
const CandyMachinesBuildersClient_1 = require("./CandyMachinesBuildersClient");
const operations_1 = require("./operations");
/**
 * @group Modules
 */
class CandyMachinesClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    builders() {
        return new CandyMachinesBuildersClient_1.CandyMachinesBuildersClient(this.metaplex);
    }
    /** {@inheritDoc createCandyMachineOperation} */
    create(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.createCandyMachineOperation)(input));
    }
    /** {@inheritDoc deleteCandyMachineOperation} */
    delete(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.deleteCandyMachineOperation)(input));
    }
    /** {@inheritDoc findCandyMachinesByPublicKeyFieldOperation} */
    findAllBy(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findCandyMachinesByPublicKeyFieldOperation)(input));
    }
    /** {@inheritDoc findCandyMachineByAddressOperation} */
    findByAddress(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findCandyMachineByAddressOperation)(input));
    }
    /** {@inheritDoc findMintedNftsByCandyMachineOperation} */
    findMintedNfts(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findMintedNftsByCandyMachineOperation)(input));
    }
    /** {@inheritDoc insertItemsToCandyMachineOperation} */
    insertItems(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.insertItemsToCandyMachineOperation)(input));
    }
    /** {@inheritDoc mintCandyMachineOperation} */
    mint(input) {
        return this.metaplex.operations().getTask((0, operations_1.mintCandyMachineOperation)(input));
    }
    /**
     * Helper method that refetches a given Candy Machine.
     */
    refresh(candyMachine, input) {
        return this.findByAddress(Object.assign({ address: (0, types_1.toPublicKey)(candyMachine) }, input));
    }
    /** {@inheritDoc updateCandyMachineOperation} */
    update(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.updateCandyMachineOperation)(input));
    }
}
exports.CandyMachinesClient = CandyMachinesClient;
//# sourceMappingURL=CandyMachinesClient.js.map