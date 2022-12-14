'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mplAuctionHouse = require('@metaplex-foundation/mpl-auction-house');
var BigNumber = require('../../types/BigNumber.cjs');

const AUCTIONEER_PRICE = BigNumber.toBigNumber('18446744073709551615');
const AUCTIONEER_ALL_SCOPES = [mplAuctionHouse.AuthorityScope.Deposit, mplAuctionHouse.AuthorityScope.Buy, mplAuctionHouse.AuthorityScope.PublicBuy, mplAuctionHouse.AuthorityScope.ExecuteSale, mplAuctionHouse.AuthorityScope.Sell, mplAuctionHouse.AuthorityScope.Cancel, mplAuctionHouse.AuthorityScope.Withdraw];

exports.AUCTIONEER_ALL_SCOPES = AUCTIONEER_ALL_SCOPES;
exports.AUCTIONEER_PRICE = AUCTIONEER_PRICE;
//# sourceMappingURL=constants.cjs.map
