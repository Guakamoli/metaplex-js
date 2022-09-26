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
exports.findCandyMachinesByPublicKeyFieldOperationHandler = exports.findCandyMachinesByPublicKeyFieldOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const accounts_1 = require("../accounts");
const CandyMachine_1 = require("../models/CandyMachine");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'FindCandyMachinesByPublicKeyOperation';
/**
 * @group Operations
 * @category Constructors
 */
exports.findCandyMachinesByPublicKeyFieldOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findCandyMachinesByPublicKeyFieldOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { type, publicKey, commitment } = operation.input;
        const accounts = program_1.CandyMachineProgram.accounts(metaplex).mergeConfig({
            commitment,
        });
        let candyMachineQuery;
        switch (type) {
            case 'authority':
                candyMachineQuery =
                    accounts.candyMachineAccountsForAuthority(publicKey);
                break;
            case 'wallet':
                candyMachineQuery = accounts.candyMachineAccountsForWallet(publicKey);
                break;
            default:
                throw new errors_1.UnreachableCaseError(type);
        }
        const unparsedAccounts = yield candyMachineQuery.get();
        scope.throwIfCanceled();
        const collectionPdas = unparsedAccounts.map((unparsedAccount) => (0, pdas_1.findCandyMachineCollectionPda)(unparsedAccount.publicKey));
        const unparsedCollectionAccounts = yield metaplex
            .rpc()
            .getMultipleAccounts(collectionPdas, commitment);
        scope.throwIfCanceled();
        return (0, utils_1.zipMap)(unparsedAccounts, unparsedCollectionAccounts, (unparsedAccount, unparsedCollectionAccount) => {
            const account = (0, accounts_1.parseCandyMachineAccount)(unparsedAccount);
            const collectionAccount = unparsedCollectionAccount
                ? (0, accounts_1.parseCandyMachineCollectionAccount)(unparsedCollectionAccount)
                : null;
            return (0, CandyMachine_1.toCandyMachine)(account, unparsedAccount, collectionAccount);
        });
    }),
};
//# sourceMappingURL=findCandyMachinesByPublicKeyField.js.map