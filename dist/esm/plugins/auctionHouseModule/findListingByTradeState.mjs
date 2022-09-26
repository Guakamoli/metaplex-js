import { toListingReceiptAccount } from './accounts.mjs';
import { toLazyListing } from './Listing.mjs';
import { findListingReceiptPda } from './pdas.mjs';
import { useOperation } from '../../types/Operation.mjs';

// Operation
// -----------------

const Key = 'FindListingByTradeStateOperation';
/**
 * @group Operations
 * @category Constructors
 */

const findListingByTradeStateOperation = useOperation(Key);
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
    const receiptAddress = findListingReceiptPda(tradeStateAddress);
    const account = toListingReceiptAccount(await metaplex.rpc().getAccount(receiptAddress, commitment));
    scope.throwIfCanceled();
    const lazyListing = toLazyListing(account, auctionHouse);
    return metaplex.auctions().for(auctionHouse).loadListing(lazyListing, {
      loadJsonMetadata,
      commitment
    }).run(scope);
  }
};

export { findListingByTradeStateOperation, findListingByTradeStateOperationHandler };
//# sourceMappingURL=findListingByTradeState.mjs.map
