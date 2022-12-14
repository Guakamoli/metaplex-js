'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('../constants.cjs');
var assert = require('../../../utils/assert.cjs');
var Amount = require('../../../types/Amount.cjs');

/** @group Models */

/** @group Model Helpers */
const isMint = value => typeof value === 'object' && value.model === 'mint';
/** @group Model Helpers */

function assertMint(value) {
  assert["default"](isMint(value), `Expected Mint model`);
}
/** @group Model Helpers */

const toMint = account => {
  const isWrappedSol = account.publicKey.equals(constants.WRAPPED_SOL_MINT);
  const currency = {
    symbol: isWrappedSol ? 'SOL' : 'Token',
    decimals: account.data.decimals,
    namespace: 'spl-token'
  };
  return {
    model: 'mint',
    address: account.publicKey,
    mintAuthorityAddress: account.data.mintAuthorityOption ? account.data.mintAuthority : null,
    freezeAuthorityAddress: account.data.freezeAuthorityOption ? account.data.freezeAuthority : null,
    decimals: account.data.decimals,
    supply: Amount.amount(account.data.supply.toString(), currency),
    isWrappedSol,
    currency
  };
};

exports.assertMint = assertMint;
exports.isMint = isMint;
exports.toMint = toMint;
//# sourceMappingURL=Mint.cjs.map
