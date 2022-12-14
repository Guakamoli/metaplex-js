'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mplTokenMetadata = require('@metaplex-foundation/mpl-token-metadata');
var gpaBuilders = require('./gpaBuilders.cjs');
var NftClient = require('./NftClient.cjs');
var program = require('./program.cjs');
var approveNftCollectionAuthority = require('./operations/approveNftCollectionAuthority.cjs');
var approveNftUseAuthority = require('./operations/approveNftUseAuthority.cjs');
var createNft = require('./operations/createNft.cjs');
var createSft = require('./operations/createSft.cjs');
var deleteNft = require('./operations/deleteNft.cjs');
var findNftByMetadata = require('./operations/findNftByMetadata.cjs');
var findNftByMint = require('./operations/findNftByMint.cjs');
var findNftByToken = require('./operations/findNftByToken.cjs');
var findNftsByCreator = require('./operations/findNftsByCreator.cjs');
var findNftsByMintList = require('./operations/findNftsByMintList.cjs');
var findNftsByOwner = require('./operations/findNftsByOwner.cjs');
var findNftsByUpdateAuthority = require('./operations/findNftsByUpdateAuthority.cjs');
var freezeDelegatedNft = require('./operations/freezeDelegatedNft.cjs');
var loadMetadata = require('./operations/loadMetadata.cjs');
var migrateToSizedCollectionNft = require('./operations/migrateToSizedCollectionNft.cjs');
var printNewEdition = require('./operations/printNewEdition.cjs');
var revokeNftCollectionAuthority = require('./operations/revokeNftCollectionAuthority.cjs');
var revokeNftUseAuthority = require('./operations/revokeNftUseAuthority.cjs');
var thawDelegatedNft = require('./operations/thawDelegatedNft.cjs');
var unverifyNftCollection = require('./operations/unverifyNftCollection.cjs');
var unverifyNftCreator = require('./operations/unverifyNftCreator.cjs');
var updateNft = require('./operations/updateNft.cjs');
var uploadMetadata = require('./operations/uploadMetadata.cjs');
var useNft = require('./operations/useNft.cjs');
var verifyNftCollection = require('./operations/verifyNftCollection.cjs');
var verifyNftCreator = require('./operations/verifyNftCreator.cjs');

/** @group Plugins */

const nftModule = () => ({
  install(metaplex) {
    // Token Metadata Program.
    metaplex.programs().register({
      name: 'TokenMetadataProgram',
      address: program.TokenMetadataProgram.publicKey,
      errorResolver: error => mplTokenMetadata.cusper.errorFromProgramLogs(error.logs, false),
      gpaResolver: metaplex => new gpaBuilders.TokenMetadataGpaBuilder(metaplex, program.TokenMetadataProgram.publicKey)
    }); // Operations.

    const op = metaplex.operations();
    op.register(approveNftCollectionAuthority.approveNftCollectionAuthorityOperation, approveNftCollectionAuthority.approveNftCollectionAuthorityOperationHandler);
    op.register(approveNftUseAuthority.approveNftUseAuthorityOperation, approveNftUseAuthority.approveNftUseAuthorityOperationHandler);
    op.register(createNft.createNftOperation, createNft.createNftOperationHandler);
    op.register(createSft.createSftOperation, createSft.createSftOperationHandler);
    op.register(deleteNft.deleteNftOperation, deleteNft.deleteNftOperationHandler);
    op.register(findNftByMetadata.findNftByMetadataOperation, findNftByMetadata.findNftByMetadataOperationHandler);
    op.register(findNftByMint.findNftByMintOperation, findNftByMint.findNftByMintOperationHandler);
    op.register(findNftByToken.findNftByTokenOperation, findNftByToken.findNftByTokenOperationHandler);
    op.register(findNftsByCreator.findNftsByCreatorOperation, findNftsByCreator.findNftsByCreatorOperationHandler);
    op.register(findNftsByMintList.findNftsByMintListOperation, findNftsByMintList.findNftsByMintListOperationHandler);
    op.register(findNftsByOwner.findNftsByOwnerOperation, findNftsByOwner.findNftsByOwnerOperationHandler);
    op.register(findNftsByUpdateAuthority.findNftsByUpdateAuthorityOperation, findNftsByUpdateAuthority.findNftsByUpdateAuthorityOperationHandler);
    op.register(freezeDelegatedNft.freezeDelegatedNftOperation, freezeDelegatedNft.freezeDelegatedNftOperationHandler);
    op.register(loadMetadata.loadMetadataOperation, loadMetadata.loadMetadataOperationHandler);
    op.register(migrateToSizedCollectionNft.migrateToSizedCollectionNftOperation, migrateToSizedCollectionNft.migrateToSizedCollectionNftOperationHandler);
    op.register(printNewEdition.printNewEditionOperation, printNewEdition.printNewEditionOperationHandler);
    op.register(revokeNftCollectionAuthority.revokeNftCollectionAuthorityOperation, revokeNftCollectionAuthority.revokeNftCollectionAuthorityOperationHandler);
    op.register(revokeNftUseAuthority.revokeNftUseAuthorityOperation, revokeNftUseAuthority.revokeNftUseAuthorityOperationHandler);
    op.register(thawDelegatedNft.thawDelegatedNftOperation, thawDelegatedNft.thawDelegatedNftOperationHandler);
    op.register(unverifyNftCollection.unverifyNftCollectionOperation, unverifyNftCollection.unverifyNftCollectionOperationHandler);
    op.register(unverifyNftCreator.unverifyNftCreatorOperation, unverifyNftCreator.unverifyNftCreatorOperationHandler);
    op.register(updateNft.updateNftOperation, updateNft.updateNftOperationHandler);
    op.register(uploadMetadata.uploadMetadataOperation, uploadMetadata.uploadMetadataOperationHandler);
    op.register(useNft.useNftOperation, useNft.useNftOperationHandler);
    op.register(verifyNftCollection.verifyNftCollectionOperation, verifyNftCollection.verifyNftCollectionOperationHandler);
    op.register(verifyNftCreator.verifyNftCreatorOperation, verifyNftCreator.verifyNftCreatorOperationHandler);

    metaplex.nfts = function () {
      return new NftClient.NftClient(this);
    };
  }

});

exports.nftModule = nftModule;
//# sourceMappingURL=plugin.cjs.map
