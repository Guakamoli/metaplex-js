'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mplTokenMetadata = require('@metaplex-foundation/mpl-token-metadata');
var Account = require('../../types/Account.cjs');

/** @group Accounts */

/** @group Account Helpers */
const parseMetadataAccount = Account.getAccountParsingFunction(mplTokenMetadata.Metadata);
/** @group Account Helpers */

const toMetadataAccount = Account.getAccountParsingAndAssertingFunction(mplTokenMetadata.Metadata);
/** @group Accounts */

const originalOrPrintEditionAccountParser = {
  name: 'MasterEditionV1 | MasterEditionV2 | Edition',
  deserialize: (data, offset = 0) => {
    if ((data === null || data === void 0 ? void 0 : data[0]) === mplTokenMetadata.Key.MasterEditionV1) {
      return mplTokenMetadata.MasterEditionV1.deserialize(data, offset);
    } else if ((data === null || data === void 0 ? void 0 : data[0]) === mplTokenMetadata.Key.MasterEditionV2) {
      return mplTokenMetadata.MasterEditionV2.deserialize(data, offset);
    } else {
      return mplTokenMetadata.Edition.deserialize(data, offset);
    }
  }
};
/** @group Account Helpers */

const parseOriginalOrPrintEditionAccount = Account.getAccountParsingFunction(originalOrPrintEditionAccountParser);
/** @group Account Helpers */

const toOriginalOrPrintEditionAccount = Account.getAccountParsingAndAssertingFunction(originalOrPrintEditionAccountParser);
/** @group Account Helpers */

const isOriginalEditionAccount = account => {
  return 'maxSupply' in account.data;
};
/** @group Account Helpers */

const isPrintEditionAccount = account => {
  return !isOriginalEditionAccount(account);
};
/** @group Accounts */

const originalEditionAccountParser = {
  name: 'MasterEditionV1 | MasterEditionV2',
  deserialize: (data, offset = 0) => {
    if ((data === null || data === void 0 ? void 0 : data[0]) === mplTokenMetadata.Key.MasterEditionV1) {
      return mplTokenMetadata.MasterEditionV1.deserialize(data, offset);
    } else {
      return mplTokenMetadata.MasterEditionV2.deserialize(data, offset);
    }
  }
};
/** @group Account Helpers */

const parseOriginalEditionAccount = Account.getAccountParsingFunction(originalEditionAccountParser);
/** @group Account Helpers */

const toOriginalEditionAccount = Account.getAccountParsingAndAssertingFunction(originalEditionAccountParser);
/** @group Accounts */

/** @group Account Helpers */
const parsePrintEditionAccount = Account.getAccountParsingFunction(mplTokenMetadata.Edition);
/** @group Account Helpers */

const toPrintEditionAccount = Account.getAccountParsingAndAssertingFunction(mplTokenMetadata.Edition);

exports.isOriginalEditionAccount = isOriginalEditionAccount;
exports.isPrintEditionAccount = isPrintEditionAccount;
exports.parseMetadataAccount = parseMetadataAccount;
exports.parseOriginalEditionAccount = parseOriginalEditionAccount;
exports.parseOriginalOrPrintEditionAccount = parseOriginalOrPrintEditionAccount;
exports.parsePrintEditionAccount = parsePrintEditionAccount;
exports.toMetadataAccount = toMetadataAccount;
exports.toOriginalEditionAccount = toOriginalEditionAccount;
exports.toOriginalOrPrintEditionAccount = toOriginalOrPrintEditionAccount;
exports.toPrintEditionAccount = toPrintEditionAccount;
//# sourceMappingURL=accounts.cjs.map
