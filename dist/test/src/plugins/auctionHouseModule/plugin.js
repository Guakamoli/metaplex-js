"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auctionHouseModule = void 0;
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const AuctionsClient_1 = require("./AuctionsClient");
const program_1 = require("./program");
const cancelBid_1 = require("./cancelBid");
const cancelListing_1 = require("./cancelListing");
const createAuctionHouse_1 = require("./createAuctionHouse");
const createBid_1 = require("./createBid");
const createListing_1 = require("./createListing");
const executeSale_1 = require("./executeSale");
const findAuctionHouseByAddress_1 = require("./findAuctionHouseByAddress");
const findBidByReceipt_1 = require("./findBidByReceipt");
const findBidByTradeState_1 = require("./findBidByTradeState");
const findListingByReceipt_1 = require("./findListingByReceipt");
const findListingByTradeState_1 = require("./findListingByTradeState");
const findPurchaseByAddress_1 = require("./findPurchaseByAddress");
const updateAuctionHouse_1 = require("./updateAuctionHouse");
const loadBid_1 = require("./loadBid");
const loadListing_1 = require("./loadListing");
const loadPurchase_1 = require("./loadPurchase");
/** @group Plugins */
const auctionHouseModule = () => ({
    install(metaplex) {
        // Auction House Program.
        metaplex.programs().register({
            name: 'AuctionHouseProgram',
            address: program_1.AuctionHouseProgram.publicKey,
            errorResolver: (error) => mpl_auction_house_1.cusper.errorFromProgramLogs(error.logs, false),
        });
        const op = metaplex.operations();
        op.register(cancelBid_1.cancelBidOperation, cancelBid_1.cancelBidOperationHandler);
        op.register(cancelListing_1.cancelListingOperation, cancelListing_1.cancelListingOperationHandler);
        op.register(createAuctionHouse_1.createAuctionHouseOperation, createAuctionHouse_1.createAuctionHouseOperationHandler);
        op.register(createBid_1.createBidOperation, createBid_1.createBidOperationHandler);
        op.register(createListing_1.createListingOperation, createListing_1.createListingOperationHandler);
        op.register(executeSale_1.executeSaleOperation, executeSale_1.executeSaleOperationHandler);
        op.register(findAuctionHouseByAddress_1.findAuctionHouseByAddressOperation, findAuctionHouseByAddress_1.findAuctionHouseByAddressOperationHandler);
        op.register(findBidByReceipt_1.findBidByReceiptOperation, findBidByReceipt_1.findBidByReceiptOperationHandler);
        op.register(findBidByTradeState_1.findBidByTradeStateOperation, findBidByTradeState_1.findBidByTradeStateOperationHandler);
        op.register(findListingByReceipt_1.findListingByReceiptOperation, findListingByReceipt_1.findListingByReceiptOperationHandler);
        op.register(findListingByTradeState_1.findListingByTradeStateOperation, findListingByTradeState_1.findListingByTradeStateOperationHandler);
        op.register(findPurchaseByAddress_1.findPurchaseByAddressOperation, findPurchaseByAddress_1.findPurchaseByAddressOperationHandler);
        op.register(loadBid_1.loadBidOperation, loadBid_1.loadBidOperationHandler);
        op.register(loadListing_1.loadListingOperation, loadListing_1.loadListingOperationHandler);
        op.register(loadPurchase_1.loadPurchaseOperation, loadPurchase_1.loadPurchaseOperationHandler);
        op.register(updateAuctionHouse_1.updateAuctionHouseOperation, updateAuctionHouse_1.updateAuctionHouseOperationHandler);
        metaplex.auctions = function () {
            return new AuctionsClient_1.AuctionsClient(this);
        };
    },
});
exports.auctionHouseModule = auctionHouseModule;
//# sourceMappingURL=plugin.js.map