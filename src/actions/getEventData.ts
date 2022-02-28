import { Commitment, Connection, PublicKey } from '@solana/web3.js';

import { EVENT_ACCOUNT_SIZE, EventAccountLayout } from '../state/event';

/**
 * Get and decode data from solana
 */
export async function getAndDecodeEventAccountData(
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
