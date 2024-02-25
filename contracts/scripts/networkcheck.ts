import { Mina, fetchLastBlock } from 'o1js';

const networks: string[][] = [
  ['https://proxy.testworld.minaexplorer.com/graphql'],
  [
    'https://berkeley.minascan.io/graphql',
    'https://proxy.berkeley.minaexplorer.com/graphql',
  ],
];

async function checkConnection(endpoints: string[][]) {
  // const connection = Mina.BerkeleyQANet(endpoint);
  console.log('testing', endpoints);
  let instance = Mina.Network({
    mina: endpoints,
  });
  try {
    Mina.setActiveInstance(instance);
    console.log('successfully set active instance');
  } catch (err) {
    console.log('failed to set active instance');
  }
  for (let j = 0; j < endpoints.length; ++j) {
    const endpoint = endpoints[j];
    console.log('fetching last block with', endpoint);
    try {
      const block = await fetchLastBlock(endpoint);
      const length = block.blockchainLength.toJSON();
      console.log('blockchain length', length);
    } catch (err) {
      console.log('failed to fetch last block');
    }
  }
}

for (let i = 0; i < networks.length; ++i) {
  if (i > 0) {
    console.log();
  }
  const endpoint = networks[i];
  await checkConnection(endpoint);
}
