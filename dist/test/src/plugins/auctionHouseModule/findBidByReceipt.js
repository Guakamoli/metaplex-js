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
exports.findBidByReceiptOperationHandler = exports.findBidByReceiptOperation = void 0;
const types_1 = require("../../types");
const Bid_1 = require("./Bid");
const accounts_1 = require("./accounts");
// -----------------
// Operation
// -----------------
const Key = 'FindBidByReceiptOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.findBidByReceiptOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findBidByReceiptOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { receiptAddress, auctionHouse, commitment, loadJsonMetadata = true, } = operation.input;
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
//# sourceMappingURL=findBidByReceipt.js.map