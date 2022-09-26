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
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
const web3_js_1 = require("@solana/web3.js");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[candyMachineModule] find all candy machines by wallet', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two candy machines from wallet A.
    const mx = yield (0, helpers_1.metaplex)();
    const walletA = web3_js_1.Keypair.generate();
    yield Promise.all([
        (0, helpers_2.createCandyMachine)(mx, { wallet: walletA.publicKey }),
        (0, helpers_2.createCandyMachine)(mx, { wallet: walletA.publicKey }),
    ]);
    // And one candy machine from wallet B.
    const walletB = web3_js_1.Keypair.generate();
    yield (0, helpers_2.createCandyMachine)(mx, { wallet: walletB.publicKey });
    // When I find all candy machines from wallet A.
    const candyMachines = yield mx
        .candyMachines()
        .findAllBy({ type: 'wallet', publicKey: walletA.publicKey })
        .run();
    // Then we got two candy machines.
    t.equal(candyMachines.length, 2, 'returns two accounts');
    // And they both are from wallet A.
    candyMachines.forEach((candyMachine) => {
        t.ok(candyMachine.walletAddress.equals(walletA.publicKey), 'wallet matches');
    });
}));
(0, tape_1.default)('[candyMachineModule] find all candy machines by authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two candy machines from authority A.
    const mx = yield (0, helpers_1.metaplex)();
    const authorityA = web3_js_1.Keypair.generate();
    yield Promise.all([
        (0, helpers_2.createCandyMachine)(mx, { authority: authorityA.publicKey }),
        (0, helpers_2.createCandyMachine)(mx, { authority: authorityA.publicKey }),
    ]);
    // And one candy machine from authority B.
    const authorityB = web3_js_1.Keypair.generate();
    yield (0, helpers_2.createCandyMachine)(mx, { authority: authorityB.publicKey });
    // When I find all candy machines from authority A.
    const candyMachines = yield mx
        .candyMachines()
        .findAllBy({ type: 'authority', publicKey: authorityA.publicKey })
        .run();
    // Then we got two candy machines.
    t.equal(candyMachines.length, 2, 'returns two accounts');
    // And they both are from authority A.
    candyMachines.forEach((candyMachine) => {
        t.ok(candyMachine.authorityAddress.equals(authorityA.publicKey), 'authority matches');
    });
}));
//# sourceMappingURL=findCandyMachinesByPublicKeyField.test.js.map