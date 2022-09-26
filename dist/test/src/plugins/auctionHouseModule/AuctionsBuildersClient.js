"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionsBuildersClient = void 0;
const createAuctionHouse_1 = require("./createAuctionHouse");
const createBid_1 = require("./createBid");
const createListing_1 = require("./createListing");
const executeSale_1 = require("./executeSale");
const updateAuctionHouse_1 = require("./updateAuctionHouse");
/**
 * @group Module Builders
 */
class AuctionsBuildersClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    bid(input) {
        return (0, createBid_1.createBidBuilder)(this.metaplex, input);
    }
    createAuctionHouse(input) {
        return (0, createAuctionHouse_1.createAuctionHouseBuilder)(this.metaplex, input);
    }
    list(input) {
        return (0, createListing_1.createListingBuilder)(this.metaplex, input);
    }
    executeSale(input) {
        return (0, executeSale_1.executeSaleBuilder)(this.metaplex, input);
    }
    updateAuctionHouse(input) {
        return (0, updateAuctionHouse_1.updateAuctionHouseBuilder)(this.metaplex, input);
    }
}
exports.AuctionsBuildersClient = AuctionsBuildersClient;
//# sourceMappingURL=AuctionsBuildersClient.js.map