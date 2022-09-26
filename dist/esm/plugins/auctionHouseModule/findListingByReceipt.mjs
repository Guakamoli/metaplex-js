import { toListingReceiptAccount } from './accounts.mjs';
import { toLazyListing } from './Listing.mjs';
import { useOperation } from '../../types/Operation.mjs';

// -----------------
// Operation
// -----------------
const Key = 'FindListingByReceiptOperation';
/**
 * @group Operations
 * @category Constructors
 */

const findListingByReceiptOperation = useOperation(Key);
/**
 * @group Operations
 * @category Types
 */

/**
 * @group Operations
 * @category Handlers
 */
const findListingByReceiptOperationHandler = {
  handle: async (operation, metaplex, scope) => {
    const {
      receiptAddress,
      auctionHouse,
      commitment,
      loadJsonMetadata = true
    } = operation.input;
    const account = toListingReceiptAccount(await metaplex.rpc().getAccount(receiptAddress, commitment));
    scope.throwIfCanceled();
    const lazyListing = toLazyListing(account, auctionHouse);
    return metaplex.auctions().for(auctionHouse).loadListing(lazyListing, {
      loadJsonMetadata,
      commitment
    }).run(scope);
  }
};

export { findListingByReceiptOperation, findListingByReceiptOperationHandler };
//# sourceMappingURL=findListingByReceipt.mjs.map
