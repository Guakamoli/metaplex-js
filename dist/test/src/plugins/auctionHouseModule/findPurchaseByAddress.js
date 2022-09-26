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
exports.findPurchaseByAddressOperationHandler = exports.findPurchaseByAddressOperation = void 0;
const types_1 = require("../../types");
const accounts_1 = require("./accounts");
const Purchase_1 = require("./Purchase");
const pdas_1 = require("./pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindPurchaseByAddressOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.findPurchaseByAddressOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findPurchaseByAddressOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { sellerTradeState, buyerTradeState, auctionHouse, commitment, loadJsonMetadata = true, } = operation.input;
        const receiptAddress = (0, pdas_1.findPurchaseReceiptPda)(sellerTradeState, buyerTradeState);
        const account = (0, accounts_1.toPurchaseReceiptAccount)(yield metaplex.rpc().getAccount(receiptAddress, commitment));
        scope.throwIfCanceled();
        const lazyPurchase = (0, Purchase_1.toLazyPurchase)(account, auctionHouse);
        return metaplex
            .auctions()
            .for(auctionHouse)
            .loadPurchase(lazyPurchase, { loadJsonMetadata, commitment })
            .run(scope);
    }),
};
//# sourceMappingURL=findPurchaseByAddress.js.map