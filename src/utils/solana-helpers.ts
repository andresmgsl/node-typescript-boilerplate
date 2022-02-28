import { AccountInfo, Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  EVENT_PROGRAM_ID,
  SOLANA_NETWORK,
  WALLET_FILE_PATH,
} from '../constants';

import { promises } from 'fs';
// import os from 'os';
// import path from 'path';
// import yaml from 'yaml';

// interface SolanaConfigFile {
//   json_rpc_url: string;
//   websocket_url: string;
//   keypair_path: string;
//   address_labels: {
//     [key: string]: string; // any (?)
//   };
//   commitment: string;
// }

// async function getConfig(): Promise<SolanaConfigFile> {
//   console.log(path); // UNDEFINED ??
//   // Path to Solana CLI config file
//   const CONFIG_FILE_PATH = path.resolve(
//     os.homedir(),
//     '.config',
//     'solana',
//     'cli',
//     'config.yml',
//   );
//   console.log('PAATH', CONFIG_FILE_PATH);
//   const configYml = await promises.readFile(CONFIG_FILE_PATH, {
//     encoding: 'utf8',
//   });
//   return yaml.parse(configYml);
// }

/**
 * Check if program deployed
 */
export async function checkProgram(): Promise<[boolean, AccountInfo<Buffer>]> {
  const connection = new Connection(SOLANA_NETWORK.LOCAL_NET); // obviamente esto lo moveremos, es por prueba
  const eventPubKey = new PublicKey(EVENT_PROGRAM_ID);
  const programInfo = await connection.getAccountInfo(eventPubKey);

  if (programInfo === null) {
    return [false, null];
  } else if (!programInfo.executable) {
    return [false, null];
  }

  return [true, programInfo];
}

/**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
export async function createKeypairFromFile(
  filePath: string,
): Promise<Keypair> {
  const secretKeyString = await promises.readFile(filePath, {
    encoding: 'utf8',
  });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

/**
 * Load and parse the Solana CLI config file to determine which payer to use
 */
export async function getPayer(): Promise<Keypair> {
  try {
    // const config = await getConfig();
    // if (!config.keypair_path) throw new Error('Missing keypair path');
    // console.log('CONFIG SOLANA', config);
    return await createKeypairFromFile(WALLET_FILE_PATH);
  } catch (err) {
    console.log(err);
    console.warn(
      'Failed to create keypair from CLI config file, falling back to new random keypair',
    );
    return Keypair.generate();
  }
}
