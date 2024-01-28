import { Mina, fetchLastBlock } from 'o1js';

const networks: string[] = [
  'https://proxy.testworld.minaexplorer.com/graphql',
  'https://proxy.berkeley.minaexplorer.com/graphql',
];

async function checkConnection(endpoint: string) {
  const connection = Mina.BerkeleyQANet(endpoint);
  console.log('testing', endpoint);
  try {
    Mina.setActiveInstance(connection);
    console.log('successfully set active instance');
  } catch (err) {
    console.log('failed to set active instance');
  }
  try {
    const block = await fetchLastBlock(endpoint);
    const length = block.blockchainLength.toJSON();
    console.log('blockchain length', length);
  } catch (err) {
    console.log('failed to fetch last block');
  }
}

for (let i = 0; i < networks.length; ++i) {
  if (i > 0) {
    console.log();
  }
  const endpoint = networks[i];
  await checkConnection(endpoint);
}
