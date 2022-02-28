import { CString, struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { EVENT_PROGRAM_ID } from '../constants';
import { EVENT_ACCOUNT_SIZE } from '../state/event';

const eventProgramId = new PublicKey(EVENT_PROGRAM_ID);

// all this to move
interface InitializeMintInstructionData {
  eventId: bigint;
  name: string;
}

const initializeMintInstructionData = struct<InitializeMintInstructionData>([
  u64('eventId'),
  new CString('name'),
]);

function createInitializeEventAccountInstruction(
  eventAccount: PublicKey,
): TransactionInstruction {
  const keys = [
    { pubkey: eventAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(initializeMintInstructionData.span);
  initializeMintInstructionData.encode(
    {
      eventId: BigInt(1),
      name: 'SOLANE',
    },
    data,
  );

  return new TransactionInstruction({ keys, programId: eventProgramId, data });
}

/**
 * Create Event in Solana
 */
export async function createEvent(
  connection: Connection,
  payer: Keypair,
  keypair = Keypair.generate(),
) {
  const lamports = await connection.getMinimumBalanceForRentExemption(
    EVENT_ACCOUNT_SIZE,
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: keypair.publicKey,
      lamports,
      space: EVENT_ACCOUNT_SIZE,
      programId: eventProgramId,
    }),
    createInitializeEventAccountInstruction(keypair.publicKey),
  );
  const TxID = await sendAndConfirmTransaction(connection, transaction, [
    payer,
    keypair,
  ]);

  console.log('SIGNATURE -> ', TxID);

  return keypair.publicKey;
}
