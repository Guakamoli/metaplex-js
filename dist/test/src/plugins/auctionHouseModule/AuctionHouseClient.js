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
exports.AuctionHouseClient = void 0;
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const createListing_1 = require("./createListing");
const findListingByReceipt_1 = require("./findListingByReceipt");
const findListingByTradeState_1 = require("./findListingByTradeState");
const loadListing_1 = require("./loadListing");
const createBid_1 = require("./createBid");
const findBidByReceipt_1 = require("./findBidByReceipt");
const findBidByTradeState_1 = require("./findBidByTradeState");
const loadBid_1 = require("./loadBid");
const executeSale_1 = require("./executeSale");
const findPurchaseByAddress_1 = require("./findPurchaseByAddress");
const loadPurchase_1 = require("./loadPurchase");
const cancelBid_1 = require("./cancelBid");
const cancelListing_1 = require("./cancelListing");
/**
 * @group Modules
 */
class AuctionHouseClient {
    constructor(metaplex, auctionHouse, auctioneerAuthority) {
        this.metaplex = metaplex;
        this.auctionHouse = auctionHouse;
        this.auctioneerAuthority = auctioneerAuthority;
    }
    cancelBid(input) {
        return this.metaplex
            .operations()
            .getTask((0, cancelBid_1.cancelBidOperation)(this.addAH(input)));
    }
    cancelListing(input) {
        return this.metaplex
            .operations()
            .getTask((0, cancelListing_1.cancelListingOperation)(this.addAH(input)));
    }
    executeSale(input) {
        return new utils_1.Task((scope) => __awaiter(this, void 0, void 0, function* () {
            const output = yield this.metaplex
                .operations()
                .execute((0, executeSale_1.executeSaleOperation)(this.addAH(input)));
            scope.throwIfCanceled();
            try {
                const purchase = yield this.findPurchaseByAddress(output.sellerTradeState, output.buyerTradeState).run(scope);
                return Object.assign({ purchase }, output);
            }
            catch (error) {
                // Fallback to manually creating a purchase from inputs and outputs.
            }
            const lazyPurchase = {
                model: 'purchase',
                lazy: true,
                auctionHouse: this.auctionHouse,
                buyerAddress: output.buyer,
                sellerAddress: output.seller,
                metadataAddress: output.metadata,
                bookkeeperAddress: output.bookkeeper,
                receiptAddress: output.receipt,
                price: output.price,
                tokens: output.tokens.basisPoints,
                createdAt: (0, types_1.now)(),
            };
            return Object.assign({ purchase: yield this.loadPurchase(lazyPurchase).run(scope) }, output);
        }));
    }
    findPurchaseByAddress(sellerTradeState, buyerTradeState, options = {}) {
        return this.metaplex.operations().getTask((0, findPurchaseByAddress_1.findPurchaseByAddressOperation)(Object.assign({ sellerTradeState,
            buyerTradeState, auctionHouse: this.auctionHouse }, options)));
    }
    loadPurchase(lazyPurchase, options = {}) {
        return this.metaplex
            .operations()
            .getTask((0, loadPurchase_1.loadPurchaseOperation)(Object.assign({ lazyPurchase }, options)));
    }
    list(input) {
        return new utils_1.Task((scope) => __awaiter(this, void 0, void 0, function* () {
            const output = yield this.metaplex
                .operations()
                .execute((0, createListing_1.createListingOperation)(this.addAH(input)), scope);
            scope.throwIfCanceled();
            if (output.receipt) {
                const listing = yield this.findListingByReceipt(output.receipt).run(scope);
                return Object.assign({ listing }, output);
            }
            scope.throwIfCanceled();
            const lazyListing = {
                model: 'listing',
                lazy: true,
                auctionHouse: this.auctionHouse,
                tradeStateAddress: output.sellerTradeState,
                bookkeeperAddress: output.bookkeeper,
                sellerAddress: output.seller,
                metadataAddress: output.metadata,
                receiptAddress: output.receipt,
                purchaseReceiptAddress: null,
                price: output.price,
                tokens: output.tokens.basisPoints,
                createdAt: (0, types_1.now)(),
                canceledAt: null,
            };
            return Object.assign({ listing: yield this.loadListing(lazyListing).run(scope) }, output);
        }));
    }
    findListingByTradeState(tradeStateAddress, options = {}) {
        return this.metaplex.operations().getTask((0, findListingByTradeState_1.findListingByTradeStateOperation)(Object.assign({ tradeStateAddress, auctionHouse: this.auctionHouse }, options)));
    }
    findListingByReceipt(receiptAddress, options = {}) {
        return this.metaplex.operations().getTask((0, findListingByReceipt_1.findListingByReceiptOperation)(Object.assign({ receiptAddress, auctionHouse: this.auctionHouse }, options)));
    }
    loadListing(lazyListing, options = {}) {
        return this.metaplex
            .operations()
            .getTask((0, loadListing_1.loadListingOperation)(Object.assign({ lazyListing }, options)));
    }
    bid(input) {
        return new utils_1.Task((scope) => __awaiter(this, void 0, void 0, function* () {
            const output = yield this.metaplex
                .operations()
                .execute((0, createBid_1.createBidOperation)(this.addAH(input)), scope);
            scope.throwIfCanceled();
            if (output.receipt) {
                const bid = yield this.findBidByReceipt(output.receipt).run(scope);
                return Object.assign({ bid }, output);
            }
            scope.throwIfCanceled();
            const lazyBid = {
                model: 'bid',
                lazy: true,
                auctionHouse: this.auctionHouse,
                tradeStateAddress: output.buyerTradeState,
                bookkeeperAddress: output.bookkeeper,
                tokenAddress: output.tokenAccount,
                buyerAddress: output.buyer,
                metadataAddress: output.metadata,
                receiptAddress: output.receipt,
                purchaseReceiptAddress: null,
                isPublic: Boolean(output.tokenAccount),
                price: output.price,
                tokens: output.tokens.basisPoints,
                createdAt: (0, types_1.now)(),
                canceledAt: null,
            };
            return Object.assign({ bid: yield this.loadBid(lazyBid).run(scope) }, output);
        }));
    }
    findBidByReceipt(receiptAddress, options = {}) {
        return this.metaplex.operations().getTask((0, findBidByReceipt_1.findBidByReceiptOperation)(Object.assign({ receiptAddress, auctionHouse: this.auctionHouse }, options)));
    }
    findBidByTradeState(tradeStateAddress, options = {}) {
        return this.metaplex.operations().getTask((0, findBidByTradeState_1.findBidByTradeStateOperation)(Object.assign({ tradeStateAddress, auctionHouse: this.auctionHouse }, options)));
    }
    loadBid(lazyBid, options = {}) {
        return this.metaplex
            .operations()
            .getTask((0, loadBid_1.loadBidOperation)(Object.assign({ lazyBid }, options)));
    }
    addAH(input) {
        return Object.assign({ auctionHouse: this.auctionHouse, auctioneerAuthority: this.auctioneerAuthority }, input);
    }
}
exports.AuctionHouseClient = AuctionHouseClient;
//# sourceMappingURL=AuctionHouseClient.js.map