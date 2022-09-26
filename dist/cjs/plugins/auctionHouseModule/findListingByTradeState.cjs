'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var accounts = require('./accounts.cjs');
var Listing = require('./Listing.cjs');
var pdas = require('./pdas.cjs');
var Operation = require('../../types/Operation.cjs');

// Operation
// -----------------

const Key = 'FindListingByTradeStateOperation';
/**
 * @group Operations
 * @category Constructors
 */

const findListingByTradeStateOperation = Operation.useOperation(Key);
/**
 * @group Operations
 * @category Types
 */

/**
 * @group Operations
 * @category Handlers
 */
const findListingByTradeStateOperationHandler = {
  handle: async (operation, metaplex, scope) => {
    const {
      tradeStateAddress,
      auctionHouse,
      commitment,
      loadJsonMetadata = true
    } = operation.input;
    const receiptAddress = pdas.findListingReceiptPda(tradeStateAddress);
    const account = accounts.toListingReceiptAccount(await metaplex.rpc().getAccount(receiptAddress, commitment));
    scope.throwIfCanceled();
    const lazyListing = Listing.toLazyListing(account, auctionHouse);
    return metaplex.auctions().for(auctionHouse).loadListing(lazyListing, {
      loadJsonMetadata,
      commitment
    }).run(scope);
  }
};

exports.findListingByTradeStateOperation = findListingByTradeStateOperation;
exports.findListingByTradeStateOperationHandler = findListingByTradeStateOperationHandler;
//# sourceMappingURL=findListingByTradeState.cjs.map
