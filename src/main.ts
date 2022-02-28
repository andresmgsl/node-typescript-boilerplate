import { Connection } from '@solana/web3.js';
import {
  getEventManagerProgramAccountData,
  getOrCreateEventAccount,
} from './actions';
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
    const eventPubkey = await getOrCreateEventAccount(connection, payer);

    console.log('Event Manager Account PubKey', eventPubkey);

    getEventManagerProgramAccountData(connection, eventPubkey);
  } else {
    console.log('Be sure you deployed the program');
  }
}

(async () => {
  initMessage();

  await main();
})();
