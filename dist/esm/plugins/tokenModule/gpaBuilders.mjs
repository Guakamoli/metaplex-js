import { TOKEN_PROGRAM_ID, MINT_SIZE, ACCOUNT_SIZE } from '@solana/spl-token';
import { GpaBuilder } from '../../utils/GpaBuilder.mjs';

/** @internal */
class MintGpaBuilder extends GpaBuilder {
  constructor(metaplex, programId) {
    super(metaplex, programId !== null && programId !== void 0 ? programId : TOKEN_PROGRAM_ID);
    this.whereSize(MINT_SIZE);
  }

  whereDoesntHaveMintAuthority() {
    return this.where(0, 0);
  }

  whereHasMintAuthority() {
    return this.where(0, 1);
  }

  whereMintAuthority(mintAuthority) {
    return this.whereHasMintAuthority().where(4, mintAuthority);
  }

  whereSupply(supply) {
    return this.where(36, supply);
  } // TODO(loris): Map the rest of the layout.
  // https://github.com/solana-labs/solana-program-library/blob/master/token/js/src/state/mint.ts#L43


}
/** @internal */

class TokenGpaBuilder extends GpaBuilder {
  constructor(metaplex, programId) {
    super(metaplex, programId !== null && programId !== void 0 ? programId : TOKEN_PROGRAM_ID);
    this.whereSize(ACCOUNT_SIZE);
  }

  selectMint() {
    return this.slice(0, 32);
  }

  whereMint(mint) {
    return this.where(0, mint);
  }

  selectOwner() {
    return this.slice(32, 32);
  }

  whereOwner(owner) {
    return this.where(32, owner);
  }

  selectAmount() {
    return this.slice(64, 8);
  }

  whereAmount(amount) {
    return this.where(64, amount);
  }

  whereDoesntHaveDelegate() {
    return this.where(72, 0);
  }

  whereHasDelegate() {
    return this.where(72, 1);
  }

  whereDelegate(delegate) {
    return this.whereHasDelegate().where(76, delegate);
  } // TODO(loris): Map the rest of the layout.
  // https://github.com/solana-labs/solana-program-library/blob/master/token/js/src/state/account.ts#L59


}

export { MintGpaBuilder, TokenGpaBuilder };
//# sourceMappingURL=gpaBuilders.mjs.map
