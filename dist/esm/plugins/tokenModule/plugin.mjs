import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenClient } from './TokenClient.mjs';
import { approveTokenDelegateAuthorityOperation, approveTokenDelegateAuthorityOperationHandler } from './operations/approveTokenDelegateAuthority.mjs';
import { createMintOperation, createMintOperationHandler } from './operations/createMint.mjs';
import { createTokenOperation, createTokenOperationHandler } from './operations/createToken.mjs';
import { createTokenWithMintOperation, createTokenWithMintOperationHandler } from './operations/createTokenWithMint.mjs';
import { findMintByAddressOperation, findMintByAddressOperationHandler } from './operations/findMintByAddress.mjs';
import { findTokenByAddressOperation, findTokenByAddressOperationHandler } from './operations/findTokenByAddress.mjs';
import { findTokenWithMintByAddressOperation, findTokenWithMintByAddressOperationHandler } from './operations/findTokenWithMintByAddress.mjs';
import { findTokenWithMintByMintOperation, findTokenWithMintByMintOperationHandler } from './operations/findTokenWithMintByMint.mjs';
import { freezeTokensOperation, freezeTokensOperationHandler } from './operations/freezeTokens.mjs';
import { mintTokensOperation, mintTokensOperationHandler } from './operations/mintTokens.mjs';
import { revokeTokenDelegateAuthorityOperation, revokeTokenDelegateAuthorityOperationHandler } from './operations/revokeTokenDelegateAuthority.mjs';
import { sendTokensOperation, sendTokensOperationHandler } from './operations/sendTokens.mjs';
import { thawTokensOperation, thawTokensOperationHandler } from './operations/thawTokens.mjs';

/**
 * @group Plugins
 */

/** @group Plugins */

const tokenModule = () => ({
  install(metaplex) {
    // Program.
    metaplex.programs().register({
      name: 'TokenProgram',
      address: TOKEN_PROGRAM_ID
    }); // Operations.

    const op = metaplex.operations();
    op.register(approveTokenDelegateAuthorityOperation, approveTokenDelegateAuthorityOperationHandler);
    op.register(createMintOperation, createMintOperationHandler);
    op.register(createTokenOperation, createTokenOperationHandler);
    op.register(createTokenWithMintOperation, createTokenWithMintOperationHandler);
    op.register(findMintByAddressOperation, findMintByAddressOperationHandler);
    op.register(findTokenByAddressOperation, findTokenByAddressOperationHandler);
    op.register(findTokenWithMintByAddressOperation, findTokenWithMintByAddressOperationHandler);
    op.register(findTokenWithMintByMintOperation, findTokenWithMintByMintOperationHandler);
    op.register(freezeTokensOperation, freezeTokensOperationHandler);
    op.register(mintTokensOperation, mintTokensOperationHandler);
    op.register(revokeTokenDelegateAuthorityOperation, revokeTokenDelegateAuthorityOperationHandler);
    op.register(sendTokensOperation, sendTokensOperationHandler);
    op.register(thawTokensOperation, thawTokensOperationHandler);

    metaplex.tokens = function () {
      return new TokenClient(this);
    };
  }

});

export { tokenModule };
//# sourceMappingURL=plugin.mjs.map
