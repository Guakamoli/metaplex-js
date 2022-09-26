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
exports.executeSaleBuilder = exports.executeSaleOperationHandler = exports.executeSaleOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../types");
const tokenModule_1 = require("../tokenModule");
const pdas_1 = require("./pdas");
const errors_1 = require("./errors");
// -----------------
// Operation
// -----------------
const Key = 'ExecuteSaleOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.executeSaleOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.executeSaleOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.executeSaleBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * @group Transaction Builders
 * @category Constructors
 */
const executeSaleBuilder = (metaplex, params) => {
    var _a, _b, _c;
    const { auctionHouse, listing, bid, auctioneerAuthority } = params;
    const { sellerAddress, asset } = listing;
    const { buyerAddress, tokens } = bid;
    if (!listing.auctionHouse.address.equals(bid.auctionHouse.address)) {
        throw new errors_1.BidAndListingHaveDifferentAuctionHousesError();
    }
    if (!listing.asset.address.equals(bid.asset.address)) {
        throw new errors_1.BidAndListingHaveDifferentMintsError();
    }
    if (bid.canceledAt) {
        throw new errors_1.CanceledBidIsNotAllowedError();
    }
    if (listing.canceledAt) {
        throw new errors_1.CanceledListingIsNotAllowedError();
    }
    if (auctionHouse.hasAuctioneer && !auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    // Data.
    const price = auctionHouse.isNative
        ? (0, types_1.lamports)(bid.price.basisPoints)
        : (0, types_1.amount)(bid.price.basisPoints, auctionHouse.treasuryMint.currency);
    // Accounts.
    const sellerPaymentReceiptAccount = auctionHouse.isNative
        ? sellerAddress
        : (0, tokenModule_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, sellerAddress);
    const buyerReceiptTokenAccount = (0, tokenModule_1.findAssociatedTokenAccountPda)(asset.address, buyerAddress);
    const escrowPayment = (0, pdas_1.findAuctionHouseBuyerEscrowPda)(auctionHouse.address, buyerAddress);
    const freeTradeState = (0, pdas_1.findAuctionHouseTradeStatePda)(auctionHouse.address, sellerAddress, auctionHouse.treasuryMint.address, asset.address, (0, types_1.lamports)(0).basisPoints, tokens.basisPoints, asset.token.address);
    const programAsSigner = (0, pdas_1.findAuctionHouseProgramAsSignerPda)();
    const accounts = {
        buyer: buyerAddress,
        seller: sellerAddress,
        tokenAccount: asset.token.address,
        tokenMint: asset.address,
        metadata: asset.metadataAddress,
        treasuryMint: auctionHouse.treasuryMint.address,
        escrowPaymentAccount: escrowPayment,
        sellerPaymentReceiptAccount,
        buyerReceiptTokenAccount,
        authority: auctionHouse.authorityAddress,
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
        auctionHouseTreasury: auctionHouse.treasuryAccountAddress,
        buyerTradeState: bid.tradeStateAddress,
        sellerTradeState: listing.tradeStateAddress,
        freeTradeState,
        programAsSigner,
    };
    // Args.
    const args = {
        freeTradeStateBump: freeTradeState.bump,
        escrowPaymentBump: escrowPayment.bump,
        programAsSignerBump: programAsSigner.bump,
        buyerPrice: price.basisPoints,
        tokenSize: tokens.basisPoints,
    };
    // Execute Sale Instruction
    let executeSaleInstruction = (0, mpl_auction_house_1.createExecuteSaleInstruction)(accounts, args);
    if (auctioneerAuthority) {
        executeSaleInstruction = (0, mpl_auction_house_1.createAuctioneerExecuteSaleInstruction)(Object.assign(Object.assign({}, accounts), { auctioneerAuthority: auctioneerAuthority.publicKey, ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority.publicKey) }), args);
    }
    // Provide additional keys to pay royalties.
    asset.creators.forEach(({ address }) => {
        executeSaleInstruction.keys.push({
            pubkey: address,
            isWritable: true,
            isSigner: false,
        });
        // Provide ATA to receive SPL token royalty if is not native SOL sale.
        if (!auctionHouse.isNative) {
            executeSaleInstruction.keys.push({
                pubkey: (0, tokenModule_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, address),
                isWritable: true,
                isSigner: false,
            });
        }
    });
    // Signers.
    const executeSaleSigners = [auctioneerAuthority].filter(types_1.isSigner);
    // Receipt.
    const shouldPrintReceipt = ((_a = params.printReceipt) !== null && _a !== void 0 ? _a : true) &&
        Boolean(listing.receiptAddress && bid.receiptAddress);
    const bookkeeper = (_b = params.bookkeeper) !== null && _b !== void 0 ? _b : metaplex.identity();
    const purchaseReceipt = (0, pdas_1.findPurchaseReceiptPda)(listing.tradeStateAddress, bid.tradeStateAddress);
    return (utils_1.TransactionBuilder.make()
        .setContext({
        sellerTradeState: listing.tradeStateAddress,
        buyerTradeState: bid.tradeStateAddress,
        buyer: buyerAddress,
        seller: sellerAddress,
        metadata: asset.metadataAddress,
        bookkeeper: shouldPrintReceipt ? bookkeeper.publicKey : null,
        receipt: shouldPrintReceipt ? purchaseReceipt : null,
        price,
        tokens,
    })
        // Execute Sale.
        .add({
        instruction: executeSaleInstruction,
        signers: executeSaleSigners,
        key: (_c = params.instructionKey) !== null && _c !== void 0 ? _c : 'executeSale',
    })
        // Print the Purchase Receipt.
        .when(shouldPrintReceipt, (builder) => builder.add({
        instruction: (0, mpl_auction_house_1.createPrintPurchaseReceiptInstruction)({
            purchaseReceipt: purchaseReceipt,
            listingReceipt: listing.receiptAddress,
            bidReceipt: bid.receiptAddress,
            bookkeeper: bookkeeper.publicKey,
            instruction: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        }, { purchaseReceiptBump: purchaseReceipt.bump }),
        signers: [bookkeeper],
        key: 'printPurchaseReceipt',
    })));
};
exports.executeSaleBuilder = executeSaleBuilder;
//# sourceMappingURL=executeSale.js.map