import { createListingOperation } from './createListing.mjs';
import { findListingByReceiptOperation } from './findListingByReceipt.mjs';
import { findListingByTradeStateOperation } from './findListingByTradeState.mjs';
import { loadListingOperation } from './loadListing.mjs';
import { createBidOperation } from './createBid.mjs';
import { findBidByReceiptOperation } from './findBidByReceipt.mjs';
import { findBidByTradeStateOperation } from './findBidByTradeState.mjs';
import { loadBidOperation } from './loadBid.mjs';
import { executeSaleOperation } from './executeSale.mjs';
import { findPurchaseByAddressOperation } from './findPurchaseByAddress.mjs';
import { loadPurchaseOperation } from './loadPurchase.mjs';
import { cancelBidOperation } from './cancelBid.mjs';
import { cancelListingOperation } from './cancelListing.mjs';
import { Task } from '../../utils/Task.mjs';
import { now } from '../../types/DateTime.mjs';

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
    return this.metaplex.operations().getTask(cancelBidOperation(this.addAH(input)));
  }

  cancelListing(input) {
    return this.metaplex.operations().getTask(cancelListingOperation(this.addAH(input)));
  }

  executeSale(input) {
    return new Task(async scope => {
      const output = await this.metaplex.operations().execute(executeSaleOperation(this.addAH(input)));
      scope.throwIfCanceled();

      try {
        const purchase = await this.findPurchaseByAddress(output.sellerTradeState, output.buyerTradeState).run(scope);
        return {
          purchase,
          ...output
        };
      } catch (error) {// Fallback to manually creating a purchase from inputs and outputs.
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
        createdAt: now()
      };
      return {
        purchase: await this.loadPurchase(lazyPurchase).run(scope),
        ...output
      };
    });
  }

  findPurchaseByAddress(sellerTradeState, buyerTradeState, options = {}) {
    return this.metaplex.operations().getTask(findPurchaseByAddressOperation({
      sellerTradeState,
      buyerTradeState,
      auctionHouse: this.auctionHouse,
      ...options
    }));
  }

  loadPurchase(lazyPurchase, options = {}) {
    return this.metaplex.operations().getTask(loadPurchaseOperation({
      lazyPurchase,
      ...options
    }));
  }

  list(input) {
    return new Task(async scope => {
      const output = await this.metaplex.operations().execute(createListingOperation(this.addAH(input)), scope);
      scope.throwIfCanceled();

      if (output.receipt) {
        const listing = await this.findListingByReceipt(output.receipt).run(scope);
        return {
          listing,
          ...output
        };
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
        createdAt: now(),
        canceledAt: null
      };
      return {
        listing: await this.loadListing(lazyListing).run(scope),
        ...output
      };
    });
  }

  findListingByTradeState(tradeStateAddress, options = {}) {
    return this.metaplex.operations().getTask(findListingByTradeStateOperation({
      tradeStateAddress,
      auctionHouse: this.auctionHouse,
      ...options
    }));
  }

  findListingByReceipt(receiptAddress, options = {}) {
    return this.metaplex.operations().getTask(findListingByReceiptOperation({
      receiptAddress,
      auctionHouse: this.auctionHouse,
      ...options
    }));
  }

  loadListing(lazyListing, options = {}) {
    return this.metaplex.operations().getTask(loadListingOperation({
      lazyListing,
      ...options
    }));
  }

  bid(input) {
    return new Task(async scope => {
      const output = await this.metaplex.operations().execute(createBidOperation(this.addAH(input)), scope);
      scope.throwIfCanceled();

      if (output.receipt) {
        const bid = await this.findBidByReceipt(output.receipt).run(scope);
        return {
          bid,
          ...output
        };
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
        createdAt: now(),
        canceledAt: null
      };
      return {
        bid: await this.loadBid(lazyBid).run(scope),
        ...output
      };
    });
  }

  findBidByReceipt(receiptAddress, options = {}) {
    return this.metaplex.operations().getTask(findBidByReceiptOperation({
      receiptAddress,
      auctionHouse: this.auctionHouse,
      ...options
    }));
  }

  findBidByTradeState(tradeStateAddress, options = {}) {
    return this.metaplex.operations().getTask(findBidByTradeStateOperation({
      tradeStateAddress,
      auctionHouse: this.auctionHouse,
      ...options
    }));
  }

  loadBid(lazyBid, options = {}) {
    return this.metaplex.operations().getTask(loadBidOperation({
      lazyBid,
      ...options
    }));
  }

  addAH(input) {
    return {
      auctionHouse: this.auctionHouse,
      auctioneerAuthority: this.auctioneerAuthority,
      ...input
    };
  }

}

export { AuctionHouseClient };
//# sourceMappingURL=AuctionHouseClient.mjs.map
