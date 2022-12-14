import { isOriginalEditionAccount } from '../accounts.mjs';
import assert from '../../../utils/assert.mjs';
import { toBigNumber, toOptionBigNumber } from '../../../types/BigNumber.mjs';

/** @group Models */

/** @group Model Helpers */
const isNftEdition = value => typeof value === 'object' && value.model === 'nftEdition';
/** @group Model Helpers */

function assertNftEdition(value) {
  assert(isNftEdition(value), `Expected NftEdition model`);
}
/** @group Model Helpers */

const toNftEdition = account => isOriginalEditionAccount(account) ? toNftOriginalEdition(account) : toNftPrintEdition(account);
/** @group Models */

/** @group Model Helpers */
const isNftOriginalEdition = value => isNftEdition(value) && value.isOriginal;
/** @group Model Helpers */

function assertNftOriginalEdition(value) {
  assert(isNftOriginalEdition(value), `Expected NftOriginalEdition model`);
}
/** @group Model Helpers */

const toNftOriginalEdition = account => ({
  model: 'nftEdition',
  isOriginal: true,
  address: account.publicKey,
  supply: toBigNumber(account.data.supply),
  maxSupply: toOptionBigNumber(account.data.maxSupply)
});
/** @group Models */

/** @group Model Helpers */
const isNftPrintEdition = value => isNftEdition(value) && !value.isOriginal;
/** @group Model Helpers */

function assertNftPrintEdition(value) {
  assert(isNftPrintEdition(value), `Expected NftPrintEdition model`);
}
/** @group Model Helpers */

const toNftPrintEdition = account => ({
  model: 'nftEdition',
  isOriginal: false,
  address: account.publicKey,
  parent: account.data.parent,
  number: toBigNumber(account.data.edition)
});

export { assertNftEdition, assertNftOriginalEdition, assertNftPrintEdition, isNftEdition, isNftOriginalEdition, isNftPrintEdition, toNftEdition, toNftOriginalEdition, toNftPrintEdition };
//# sourceMappingURL=NftEdition.mjs.map
