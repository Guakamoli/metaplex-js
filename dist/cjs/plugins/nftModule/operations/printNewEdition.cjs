'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mplTokenMetadata = require('@metaplex-foundation/mpl-token-metadata');
var web3_js = require('@solana/web3.js');
var accounts = require('../accounts.cjs');
var pdas = require('../pdas.cjs');
var NftEdition = require('../models/NftEdition.cjs');
var Operation = require('../../../types/Operation.cjs');
var Nft = require('../models/Nft.cjs');
var BigNumber = require('../../../types/BigNumber.cjs');
var Amount = require('../../../types/Amount.cjs');
var pdas$1 = require('../../tokenModule/pdas.cjs');
var TransactionBuilder = require('../../../utils/TransactionBuilder.cjs');

// Operation
// -----------------

const Key = 'PrintNewEditionOperation';
/**
 * @group Operations
 * @category Constructors
 */

const printNewEditionOperation = Operation.useOperation(Key);
/**
 * @group Operations
 * @category Types
 */

/**
 * @group Operations
 * @category Handlers
 */
const printNewEditionOperationHandler = {
  handle: async (operation, metaplex, scope) => {
    const originalEditionAccount = await metaplex.rpc().getAccount(pdas.findMasterEditionV2Pda(operation.input.originalMint));
    scope.throwIfCanceled();
    const originalEdition = NftEdition.toNftOriginalEdition(accounts.toOriginalEditionAccount(originalEditionAccount));
    const builder = await printNewEditionBuilder(metaplex, { ...operation.input,
      originalSupply: originalEdition.supply
    });
    scope.throwIfCanceled();
    const output = await builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
    scope.throwIfCanceled();
    const nft = await metaplex.nfts().findByMint({
      mintAddress: output.mintSigner.publicKey,
      tokenAddress: output.tokenAddress
    }).run(scope);
    scope.throwIfCanceled();
    Nft.assertNftWithToken(nft);
    return { ...output,
      nft
    };
  }
}; // -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */

/**
 * @group Transaction Builders
 * @category Constructors
 */
const printNewEditionBuilder = async (metaplex, params) => {
  var _params$originalToken, _params$originalToken2;

  const {
    originalMint,
    newMint = web3_js.Keypair.generate(),
    newUpdateAuthority = metaplex.identity().publicKey,
    newOwner = metaplex.identity().publicKey,
    newTokenAccount,
    payer = metaplex.identity(),
    tokenProgram,
    associatedTokenProgram,
    printNewEditionInstructionKey = 'printNewEdition'
  } = params; // Original NFT.

  const originalMetadataAddress = pdas.findMetadataPda(originalMint);
  const originalEditionAddress = pdas.findMasterEditionV2Pda(originalMint);
  const edition = BigNumber.toBigNumber(params.originalSupply.addn(1));
  const originalEditionMarkPda = pdas.findEditionMarkerPda(originalMint, edition); // New NFT.

  const newMintAuthority = web3_js.Keypair.generate(); // Will be overwritten by edition PDA.

  const newMetadataAddress = pdas.findMetadataPda(newMint.publicKey);
  const newEditionAddress = pdas.findEditionPda(newMint.publicKey);
  const sharedAccounts = {
    newMetadata: newMetadataAddress,
    newEdition: newEditionAddress,
    masterEdition: originalEditionAddress,
    newMint: newMint.publicKey,
    editionMarkPda: originalEditionMarkPda,
    newMintAuthority: newMintAuthority.publicKey,
    payer: payer.publicKey,
    newMetadataUpdateAuthority: newUpdateAuthority,
    metadata: originalMetadataAddress
  };
  const tokenWithMintBuilder = await metaplex.tokens().builders().createTokenWithMint({
    decimals: 0,
    initialSupply: Amount.token(1),
    mint: newMint,
    mintAuthority: newMintAuthority,
    freezeAuthority: newMintAuthority.publicKey,
    owner: newOwner,
    token: newTokenAccount,
    payer,
    tokenProgram,
    associatedTokenProgram,
    createMintAccountInstructionKey: params.createMintAccountInstructionKey,
    initializeMintInstructionKey: params.initializeMintInstructionKey,
    createAssociatedTokenAccountInstructionKey: params.createAssociatedTokenAccountInstructionKey,
    createTokenAccountInstructionKey: params.createTokenAccountInstructionKey,
    initializeTokenInstructionKey: params.initializeTokenInstructionKey,
    mintTokensInstructionKey: params.mintTokensInstructionKey
  });
  const {
    tokenAddress
  } = tokenWithMintBuilder.getContext();
  const originalTokenAccountOwner = (_params$originalToken = params.originalTokenAccountOwner) !== null && _params$originalToken !== void 0 ? _params$originalToken : metaplex.identity();
  const originalTokenAccount = (_params$originalToken2 = params.originalTokenAccount) !== null && _params$originalToken2 !== void 0 ? _params$originalToken2 : pdas$1.findAssociatedTokenAccountPda(originalMint, originalTokenAccountOwner.publicKey);
  return TransactionBuilder.TransactionBuilder.make().setFeePayer(payer).setContext({
    mintSigner: newMint,
    metadataAddress: newMetadataAddress,
    editionAddress: newEditionAddress,
    tokenAddress,
    updatedSupply: edition
  }) // Create the mint and token accounts before minting 1 token to the owner.
  .add(tokenWithMintBuilder) // Mint new edition.
  .add({
    instruction: mplTokenMetadata.createMintNewEditionFromMasterEditionViaTokenInstruction({ ...sharedAccounts,
      tokenAccountOwner: originalTokenAccountOwner.publicKey,
      tokenAccount: originalTokenAccount
    }, {
      mintNewEditionFromMasterEditionViaTokenArgs: {
        edition
      }
    }),
    signers: [newMint, newMintAuthority, payer, originalTokenAccountOwner],
    key: printNewEditionInstructionKey
  });
};

exports.printNewEditionBuilder = printNewEditionBuilder;
exports.printNewEditionOperation = printNewEditionOperation;
exports.printNewEditionOperationHandler = printNewEditionOperationHandler;
//# sourceMappingURL=printNewEdition.cjs.map
