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
exports.cancelListingBuilder = exports.cancelListingOperationHandler = exports.cancelListingOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../types");
const errors_1 = require("./errors");
const pdas_1 = require("./pdas");
const constants_1 = require("./constants");
// -----------------
// Operation
// -----------------
const Key = 'CancelListingOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.cancelListingOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.cancelListingOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.cancelListingBuilder)(operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * @group Transaction Builders
 * @category Constructors
 */
const cancelListingBuilder = (params) => {
    var _a;
    const { auctionHouse, auctioneerAuthority, listing } = params;
    if (auctionHouse.hasAuctioneer && !auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    // Data.
    const { asset, tradeStateAddress, price, tokens } = listing;
    const buyerPrice = auctionHouse.hasAuctioneer
        ? constants_1.AUCTIONEER_PRICE
        : price.basisPoints;
    const accounts = {
        wallet: listing.sellerAddress,
        tokenAccount: asset.token.address,
        tokenMint: asset.address,
        authority: auctionHouse.authorityAddress,
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
        tradeState: tradeStateAddress,
    };
    // Args.
    const args = {
        buyerPrice,
        tokenSize: tokens.basisPoints,
    };
    // Cancel Listing Instruction.
    let cancelListingInstruction = (0, mpl_auction_house_1.createCancelInstruction)(accounts, args);
    if (auctioneerAuthority) {
        cancelListingInstruction = (0, mpl_auction_house_1.createAuctioneerCancelInstruction)(Object.assign(Object.assign({}, accounts), { auctioneerAuthority: auctioneerAuthority.publicKey, ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority.publicKey) }), args);
    }
    // Signers.
    const cancelSigners = [auctioneerAuthority].filter(types_1.isSigner);
    return (utils_1.TransactionBuilder.make()
        // Cancel Listing.
        .add({
        instruction: cancelListingInstruction,
        signers: cancelSigners,
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'cancelListing',
    })
        // Cancel Listing Receipt.
        .when(Boolean(listing.receiptAddress), (builder) => builder.add({
        instruction: (0, mpl_auction_house_1.createCancelListingReceiptInstruction)({
            receipt: listing.receiptAddress,
            instruction: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        }),
        signers: [],
        key: 'cancelListingReceipt',
    })));
};
exports.cancelListingBuilder = cancelListingBuilder;
//# sourceMappingURL=cancelListing.js.map