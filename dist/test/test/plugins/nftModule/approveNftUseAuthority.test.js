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
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can approve a use authority for a given Nft', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance and a usable NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 10,
            total: 10,
        },
    });
    // When we approve a new use authority.
    const newUser = web3_js_1.Keypair.generate();
    yield mx
        .nfts()
        .approveUseAuthority({
        mintAddress: nft.address,
        user: newUser.publicKey,
        numberOfUses: 5,
    })
        .run();
    // Then that user can successfully use the NFT.
    yield mx
        .nfts()
        .use({
        mintAddress: nft.address,
        numberOfUses: 5,
        useAuthority: newUser,
    })
        .run();
    // And the returned NFT should have the updated data.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated Nft',
        model: 'nft',
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: (0, helpers_1.spokSameBignum)(5),
            total: (0, helpers_1.spokSameBignum)(10),
        },
    });
}));
(0, tape_1.default)('[nftModule] approve use authorities cannot use more than the agreed amount', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance and a usable NFT with 10 remaining uses.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 10,
            total: 10,
        },
    });
    // And a use authority has been approved for 5 uses only.
    const currentUser = web3_js_1.Keypair.generate();
    yield mx
        .nfts()
        .approveUseAuthority({
        mintAddress: nft.address,
        user: currentUser.publicKey,
        numberOfUses: 5,
    })
        .run();
    // When we try to use that authority for 6 uses.
    const promise = mx
        .nfts()
        .use({
        mintAddress: nft.address,
        useAuthority: currentUser,
        numberOfUses: 6,
    })
        .run();
    // Then we should get an error.
    yield (0, helpers_1.assertThrows)(t, promise, /There are not enough Uses left on this token/);
}));
//# sourceMappingURL=approveNftUseAuthority.test.js.map