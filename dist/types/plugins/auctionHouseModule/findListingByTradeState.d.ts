import type { Commitment, PublicKey } from '@solana/web3.js';
import { Operation, OperationHandler } from '../../types';
import { AuctionHouse } from './AuctionHouse';
import { Listing } from './Listing';
declare const Key: "FindListingByTradeStateOperation";
/**
 * @group Operations
 * @category Constructors
 */
export declare const findListingByTradeStateOperation: import("../../types").OperationConstructor<FindListingByTradeStateOperation, "FindListingByTradeStateOperation", FindListingByTradeStateInput, Readonly<{
    model: "listing";
    lazy: false;
    auctionHouse: AuctionHouse;
    asset: import("..").SftWithToken | import("..").NftWithToken;
    tradeStateAddress: import("../../types").Pda;
    sellerAddress: PublicKey;
    bookkeeperAddress: import("../../utils").Option<PublicKey>;
    receiptAddress: import("../../utils").Option<import("../../types").Pda>;
    purchaseReceiptAddress: import("../../utils").Option<PublicKey>;
    price: import("../../types").SplTokenAmount | import("../../types").SolAmount;
    tokens: import("../../types").SplTokenAmount;
    createdAt: import("../../types").DateTime;
    canceledAt: import("../../utils").Option<import("../../types").DateTime>;
}>>;
/**
 * @group Operations
 * @category Types
 */
export declare type FindListingByTradeStateOperation = Operation<typeof Key, FindListingByTradeStateInput, Listing>;
/**
 * @group Operations
 * @category Inputs
 */
export declare type FindListingByTradeStateInput = {
    tradeStateAddress: PublicKey;
    auctionHouse: AuctionHouse;
    loadJsonMetadata?: boolean;
    commitment?: Commitment;
};
/**
 * @group Operations
 * @category Handlers
 */
export declare const findListingByTradeStateOperationHandler: OperationHandler<FindListingByTradeStateOperation>;
export {};
