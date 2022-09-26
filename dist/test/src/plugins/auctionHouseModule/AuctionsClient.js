"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionsClient = void 0;
const utils_1 = require("../../utils");
const AuctionsBuildersClient_1 = require("./AuctionsBuildersClient");
const pdas_1 = require("./pdas");
const createAuctionHouse_1 = require("./createAuctionHouse");
const findAuctionHouseByAddress_1 = require("./findAuctionHouseByAddress");
const updateAuctionHouse_1 = require("./updateAuctionHouse");
const AuctionHouseClient_1 = require("./AuctionHouseClient");
/**
 * @group Modules
 */
class AuctionsClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    builders() {
        return new AuctionsBuildersClient_1.AuctionsBuildersClient(this.metaplex);
    }
    for(auctionHouse, auctioneerAuthority) {
        return new AuctionHouseClient_1.AuctionHouseClient(this.metaplex, auctionHouse, auctioneerAuthority);
    }
    createAuctionHouse(input) {
        return new utils_1.Task((scope) => __awaiter(this, void 0, void 0, function* () {
            const output = yield this.metaplex
                .operations()
                .getTask((0, createAuctionHouse_1.createAuctionHouseOperation)(input))
                .run(scope);
            scope.throwIfCanceled();
            const auctionHouse = yield this.findAuctionHouseByAddress(output.auctionHouseAddress, input.auctioneerAuthority).run(scope);
            return Object.assign(Object.assign({}, output), { auctionHouse });
        }));
    }
    updateAuctionHouse(auctionHouse, input) {
        return new utils_1.Task((scope) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const output = yield this.metaplex
                .operations()
                .getTask((0, updateAuctionHouse_1.updateAuctionHouseOperation)(Object.assign({ auctionHouse }, input)))
                .run(scope);
            scope.throwIfCanceled();
            const currentAuctioneerAuthority = auctionHouse.hasAuctioneer
                ? auctionHouse.auctioneer.authority
                : undefined;
            const updatedAuctionHouse = yield this.findAuctionHouseByAddress(auctionHouse.address, (_a = input.auctioneerAuthority) !== null && _a !== void 0 ? _a : currentAuctioneerAuthority).run(scope);
            return Object.assign(Object.assign({}, output), { auctionHouse: updatedAuctionHouse });
        }));
    }
    findAuctionHouseByAddress(address, auctioneerAuthority, options) {
        return this.metaplex.operations().getTask((0, findAuctionHouseByAddress_1.findAuctionHouseByAddressOperation)(Object.assign({ address,
            auctioneerAuthority }, options)));
    }
    findAuctionHouseByCreatorAndMint(creator, treasuryMint, auctioneerAuthority, options) {
        return this.findAuctionHouseByAddress((0, pdas_1.findAuctionHousePda)(creator, treasuryMint), auctioneerAuthority, options);
    }
}
exports.AuctionsClient = AuctionsClient;
//# sourceMappingURL=AuctionsClient.js.map