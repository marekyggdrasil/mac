import { Mina, PublicKey, fetchAccount } from 'o1js';

const endpoint = 'https://proxy.berkeley.minaexplorer.com/graphql'; // process.argv[2];
const address = 'B62qkThtJWtKXN56efqC4ZXqv5NMD3mvjoVg5GpLLHRv9b3z2uMrkN4'; //process.argv[3];

const connection = Mina.BerkeleyQANet(endpoint);
Mina.setActiveInstance(connection);

const pk: PublicKey = PublicKey.fromBase58(address);
const fetched_account = await fetchAccount({ publicKey: pk });

console.log(fetched_account);
