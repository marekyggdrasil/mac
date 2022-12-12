import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  UInt32,
  UInt64,
    CircuitString,
    fetchLastBlock
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Mac } from '../../contracts/src/Mac';
// import type { Participant, Outcome, Preimage } from '../../contracts/src/preimage';

import bs58 from 'bs58';
import byteify from 'byteify';

const state = {
    Mac: null as null | typeof Mac,
    //Participant: null as null | typeof Participant,
    //Outcome: null as null | typeof Outcome,
    //Preimage: null as null | typeof Preimage,
  zkapp: null as null | Mac,
  transaction: null as null | Transaction
  //preimage: null as null | Preimage
}

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
      Mina.setActiveInstance(Berkeley);
      // console.log(Berkeley.getNetworkState());
      console.log(Mina);
      let block = await fetchLastBlock(
          "https://proxy.berkeley.minaexplorer.com/graphql");
      console.log(block.blockchainLength.toString());
      // console.log(typeof(block.blockchainLength.value[1]));
  },
  loadContract: async (args: {}) => {
      const { Mac } = await import('../../contracts/build/src/Mac.js');
      // const { Preimage } = await import('../../contracts/src/preimage');
      state.Mac = Mac;
      //state.Participant = Participant;
      //state.Outcome = Outcome;
      state.Preimage = Preimage;
  },
    fetchBlockchainLength: async (args: {}) => {
        let block = await fetchLastBlock(
            "https://proxy.berkeley.minaexplorer.com/graphql");
        return block.blockchainLength.toString();
    },
  compileContract: async (args: {}) => {
      await state.Mac!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
      const publicKey = PublicKey.fromBase58(args.publicKey58);
      //const p: Participant = new Participant(publicKey);
      //console.log(p);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
      state.zkapp = new state.Mac!(publicKey);
  },
    getBlockchainLength: async (args: {}) => {
        const network_state = await Mina.getNetworkState();
        return JSON.stringify(network_state.blockchainLength.toJSON());
    },
    deploy: async (args: { privateKey58: string }) => {
        const pk: PrivateKey = PrivateKey.fromBase58(args.privateKey58);
        await state.zkapp!.deploy(_commitment);
    },
    initialize: async (args: { commitment: string }) => {
        const _commitment: Field = Field.fromJSON(args.commitment);
        await state.zkapp!.initialize(_commitment);
    },
    fromMacPack: async (args: { macpack: string }) => {
        state.preimage = state.Preimage!.fromMacPack(args.macpack);
    },
  getNum: async (args: {}) => {
    const currentNum = await state.zkapp!.num.get();
    return JSON.stringify(currentNum.toJSON());
  },
  createUpdateTransaction: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
        state.zkapp!.update();
      }
    );
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number,
  fn: WorkerFunctions,
  args: any
}

export type ZkappWorkerReponse = {
  id: number,
  data: any
}
if (process.browser) {
  addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    }
    postMessage(message)
  });
}
