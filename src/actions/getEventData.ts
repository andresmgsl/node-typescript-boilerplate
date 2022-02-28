import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { EVENT_PROGRAM_ID } from '../constants';
import { EventAccountLayout, EVENT_ACCOUNT_SIZE } from '../state/event';

export async function getOrCreateEventAccount(
  connection: Connection,
  payer: Keypair,
) {
  const EVENT_SEED = 'event-solana';
  const eventProgramId = new PublicKey(EVENT_PROGRAM_ID);
  const eventPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    EVENT_SEED,
    eventProgramId,
  );

  const eventAccount = await connection.getAccountInfo(eventPubkey);

  if (eventAccount === null) {
    console.log('Creating account', eventPubkey.toBase58());
    const lamports = await connection.getMinimumBalanceForRentExemption(
      EVENT_ACCOUNT_SIZE,
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: EVENT_SEED,
        newAccountPubkey: eventPubkey,
        lamports,
        space: EVENT_ACCOUNT_SIZE,
        programId: eventProgramId,
      }),
    );
    const TxID = await sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);

    console.log('SIGNATURE -> ', TxID);
  }

  console.log('EVENT ACCOUNT -> -> ', eventAccount);

  return eventPubkey;
}

export async function getEventManagerProgramAccountData(
  connection: Connection,
  address: PublicKey,
  commitment?: Commitment,
) {
  const info = await connection.getAccountInfo(address, commitment);
  console.log('INFOO', info);
  const rawAccount = EventAccountLayout.decode(
    info.data.slice(0, EVENT_ACCOUNT_SIZE),
  );
  console.log('RAW ACCOUNT', rawAccount);
}
