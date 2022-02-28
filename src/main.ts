import { Connection } from '@solana/web3.js';

import { getAndDecodeEventAccountData } from './actions';
import { createEvent } from './actions/createEvent';
import { SOLANA_NETWORK } from './constants';
import { checkProgram, getPayer } from './utils';
import { initMessage } from './utils/commons';

const connection = new Connection(SOLANA_NETWORK.LOCAL_NET); // obviamente esto lo moveremos, es por prueba

async function main() {
  console.log('Retreiving program info...');
  const [isDeployed, programAccount] = await checkProgram();
  console.log('Program Status : ' + isDeployed ? 'Deployed' : 'Not deployed');

  if (isDeployed) {
    console.log(
      'Program Account Info',
      programAccount,
      programAccount.owner.toBase58(),
    );

    const payer = await getPayer();
    console.log('Payer PublicKey -> ', payer.publicKey.toBase58());
    const eventPubkey = await createEvent(connection, payer);

    console.log('Event Manager Account PubKey', eventPubkey);

    getAndDecodeEventAccountData(connection, eventPubkey);
  } else {
    console.log('Be sure you deployed the program');
  }
}

(async () => {
  initMessage();

  await main();
})();
