import { CString, struct, u8 } from '@solana/buffer-layout';
import { publicKey, u64 } from '@solana/buffer-layout-utils';
import { PublicKey } from '@solana/web3.js';

export interface EventAccount {
  authority: PublicKey;
  name: string;
  accepted_mint: PublicKey;
  event_mint: PublicKey;
  gain_vault: PublicKey;
  temporal_vault: PublicKey;
  event_id: bigint;
  event_bump: bigint;
  event_mint_bump: bigint;
  temporal_vault_bump: bigint;
  gain_vault_bump: bigint;
}

export interface RawEventAccount {
  authority: PublicKey;
  name: string;
  acceptedMint: PublicKey;
  eventMint: PublicKey;
  gainVault: PublicKey;
  temporalVault: PublicKey;
  eventId: bigint;
  eventBump: number;
  eventMintBump: number;
  temporalVaultBump: number;
  gainVaultBump: number;
}

export const EventAccountLayout = struct<RawEventAccount>([
  publicKey('authority'),
  new CString('name'),
  publicKey('acceptedMint'),
  publicKey('eventMint'),
  publicKey('gainVault'),
  publicKey('temporalVault'),
  u64('eventId'),
  u8('eventBump'),
  u8('eventMintBump'),
  u8('temporalVaultBump'),
  u8('gainVaultBump'),
]);

export const EVENT_ACCOUNT_SIZE = EventAccountLayout.span;
