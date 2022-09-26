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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] cancel a Private Bid on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const { client } = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we put a private bid on that NFT for 1 SOL.
    const { bid } = yield client
        .bid({
        mintAccount: nft.address,
        tokenAccount: nft.token.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    t.false(bid.canceledAt);
    // When we cancel the given bid.
    yield client.cancelBid({ bid }).run();
    // Then bid receipt has canceled at date.
    const canceledBid = yield client
        .findBidByTradeState(bid.tradeStateAddress)
        .run();
    t.ok(canceledBid.canceledAt);
    // And the trade state account no longer exists.
    const bidAccount = yield mx.rpc().getAccount(bid.tradeStateAddress);
    t.false(bidAccount.exists, 'bid account no longer exists');
}));
(0, tape_1.default)('[auctionHouseModule] cancel a Public Bid on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const { client } = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we put a public bid on that NFT for 1 SOL.
    const { bid } = yield client
        .bid({
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we cancel the given bid.
    yield client.cancelBid({ bid }).run();
    // Then the trade state account no longer exists.
    const bidAccount = yield mx.rpc().getAccount(bid.tradeStateAddress);
    t.false(bidAccount.exists, 'bid account no longer exists');
}));
(0, tape_1.default)('[auctionHouseModule] cancel a Private Bid on an Auctioneer Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const { client } = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we put a private bid on that NFT for 1 SOL.
    const { bid } = yield client
        .bid({
        mintAccount: nft.address,
        tokenAccount: nft.token.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we cancel the given bid.
    yield client.cancelBid({ bid }).run();
    // Then the trade state returns the fee to the fee payer.
    const bidAccount = yield mx.rpc().getAccount(bid.tradeStateAddress);
    t.false(bidAccount.exists, 'bid account no longer exists');
}));
(0, tape_1.default)('[auctionHouseModule] cancel a Public Bid on an Auctioneer Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const { client } = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we put a public bid on that NFT for 1 SOL.
    const { bid } = yield client
        .bid({
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we cancel the given bid.
    yield client.cancelBid({ bid }).run();
    // Then the trade state returns the fee to the fee payer.
    const bidAccount = yield mx.rpc().getAccount(bid.tradeStateAddress);
    t.false(bidAccount.exists, 'bid account no longer exists');
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if executing a sale with a canceled Bid', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx);
    const { client } = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we listed that NFT for 1 SOL.
    const { listing } = yield client
        .list({
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we put a public bid on that NFT for 1 SOL.
    const { bid } = yield client
        .bid({
        buyer,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we cancel the given bid.
    yield client.cancelBid({ bid }).run();
    // When we execute a sale with given listing and canceled bid.
    const canceledBid = yield client
        .findBidByTradeState(bid.tradeStateAddress)
        .run();
    const promise = client.executeSale({ listing, bid: canceledBid }).run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /You are trying to execute a sale using a canceled Bid./);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Auctioneer Authority is not provided in Bid Cancel', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const { auctionHouse, client } = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we put a public bid on that NFT for 1 SOL.
    const { bid } = yield client
        .bid({
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we cancel the bid but without providing Auctioneer Authority.
    const promise = mx.auctions().for(auctionHouse).cancelBid({ bid }).run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /you have not provided the required "auctioneerAuthority" parameter/);
}));
//# sourceMappingURL=cancelBid.test.js.map