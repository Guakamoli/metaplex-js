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
exports.findBidByTradeStateOperationHandler = exports.findBidByTradeStateOperation = void 0;
const types_1 = require("../../types");
const pdas_1 = require("./pdas");
const Bid_1 = require("./Bid");
const accounts_1 = require("./accounts");
// -----------------
// Operation
// -----------------
const Key = 'FindBidByTradeStateOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.findBidByTradeStateOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findBidByTradeStateOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { tradeStateAddress, auctionHouse, commitment, loadJsonMetadata = true, } = operation.input;
        const receiptAddress = (0, pdas_1.findBidReceiptPda)(tradeStateAddress);
        const account = (0, accounts_1.toBidReceiptAccount)(yield metaplex.rpc().getAccount(receiptAddress, commitment));
        scope.throwIfCanceled();
        const lazyBid = (0, Bid_1.toLazyBid)(account, auctionHouse);
        return metaplex
            .auctions()
            .for(auctionHouse)
            .loadBid(lazyBid, { loadJsonMetadata, commitment })
            .run(scope);
    }),
};
//# sourceMappingURL=findBidByTradeState.js.map