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
exports.createListingBuilder = exports.createListingOperationHandler = exports.createListingOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const pdas_1 = require("./pdas");
const tokenModule_1 = require("../tokenModule");
const nftModule_1 = require("../nftModule");
const constants_1 = require("./constants");
const errors_1 = require("./errors");
// -----------------
// Operation
// -----------------
const Key = 'CreateListingOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.createListingOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createListingOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.createListingBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * @group Transaction Builders
 * @category Constructors
 */
const createListingBuilder = (metaplex, params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Data.
    const auctionHouse = params.auctionHouse;
    const tokens = (_a = params.tokens) !== null && _a !== void 0 ? _a : (0, types_1.token)(1);
    const priceBasisPoint = params.auctioneerAuthority
        ? constants_1.AUCTIONEER_PRICE
        : (_c = (_b = params.price) === null || _b === void 0 ? void 0 : _b.basisPoints) !== null && _c !== void 0 ? _c : 0;
    const price = auctionHouse.isNative
        ? (0, types_1.lamports)(priceBasisPoint)
        : (0, types_1.amount)(priceBasisPoint, auctionHouse.treasuryMint.currency);
    if (auctionHouse.hasAuctioneer && !params.auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    // Accounts.
    const seller = (_d = params.seller) !== null && _d !== void 0 ? _d : metaplex.identity();
    const authority = (_e = params.authority) !== null && _e !== void 0 ? _e : auctionHouse.authorityAddress;
    const metadata = (0, nftModule_1.findMetadataPda)(params.mintAccount);
    const tokenAccount = (_f = params.tokenAccount) !== null && _f !== void 0 ? _f : (0, tokenModule_1.findAssociatedTokenAccountPda)(params.mintAccount, (0, types_1.toPublicKey)(seller));
    const sellerTradeState = (0, pdas_1.findAuctionHouseTradeStatePda)(auctionHouse.address, (0, types_1.toPublicKey)(seller), auctionHouse.treasuryMint.address, params.mintAccount, price.basisPoints, tokens.basisPoints, tokenAccount);
    const freeSellerTradeState = (0, pdas_1.findAuctionHouseTradeStatePda)(auctionHouse.address, (0, types_1.toPublicKey)(seller), auctionHouse.treasuryMint.address, params.mintAccount, (0, types_1.lamports)(0).basisPoints, tokens.basisPoints, tokenAccount);
    const programAsSigner = (0, pdas_1.findAuctionHouseProgramAsSignerPda)();
    const accounts = {
        wallet: (0, types_1.toPublicKey)(seller),
        tokenAccount,
        metadata,
        authority: (0, types_1.toPublicKey)(authority),
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
        sellerTradeState,
        freeSellerTradeState,
        programAsSigner,
    };
    // Args.
    const args = {
        tradeStateBump: sellerTradeState.bump,
        freeTradeStateBump: freeSellerTradeState.bump,
        programAsSignerBump: programAsSigner.bump,
        buyerPrice: price.basisPoints,
        tokenSize: tokens.basisPoints,
    };
    // Sell Instruction.
    let sellInstruction;
    if (params.auctioneerAuthority) {
        sellInstruction = (0, mpl_auction_house_1.createAuctioneerSellInstruction)(Object.assign(Object.assign({}, accounts), { auctioneerAuthority: params.auctioneerAuthority.publicKey, ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse.address, params.auctioneerAuthority.publicKey) }), args);
    }
    else {
        sellInstruction = (0, mpl_auction_house_1.createSellInstruction)(accounts, args);
    }
    // Signers.
    const sellSigners = [seller, authority, params.auctioneerAuthority].filter((input) => !!input && (0, types_1.isSigner)(input));
    // Receipt.
    // Since createPrintListingReceiptInstruction can't deserialize createAuctioneerSellInstruction due to a bug
    // Don't print Auctioneer Sell receipt for the time being.
    const shouldPrintReceipt = ((_g = params.printReceipt) !== null && _g !== void 0 ? _g : true) && !params.auctioneerAuthority;
    const bookkeeper = (_h = params.bookkeeper) !== null && _h !== void 0 ? _h : metaplex.identity();
    const receipt = (0, pdas_1.findListingReceiptPda)(sellerTradeState);
    return (utils_1.TransactionBuilder.make()
        .setContext({
        sellerTradeState,
        freeSellerTradeState,
        tokenAccount,
        metadata,
        seller: (0, types_1.toPublicKey)(seller),
        receipt: shouldPrintReceipt ? receipt : null,
        bookkeeper: shouldPrintReceipt ? bookkeeper.publicKey : null,
        price,
        tokens,
    })
        // Create Listing.
        .add({
        instruction: sellInstruction,
        signers: sellSigners,
        key: 'sell',
    })
        // Print the Listing Receipt.
        .when(shouldPrintReceipt, (builder) => builder.add({
        instruction: (0, mpl_auction_house_1.createPrintListingReceiptInstruction)({
            receipt,
            bookkeeper: bookkeeper.publicKey,
            instruction: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        }, { receiptBump: receipt.bump }),
        signers: [bookkeeper],
        key: 'printListingReceipt',
    })));
};
exports.createListingBuilder = createListingBuilder;
//# sourceMappingURL=createListing.js.map