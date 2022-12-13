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
import type { Outcome, Preimage } from '../../contracts/src/strpreim';
import type { fromMacPack, toMacPack } from '../../contracts/src/helpers';

//import bs58 from 'bs58';
//import byteify from 'byteify';

const state = {
  Mac: null as null | typeof Mac,
  Outcome: null as null | typeof Outcome,
  Preimage: null as null | typeof Preimage,
  zkapp: null as null | Mac,
  preimage: null as null | Preimage,
  transaction: null as null | Transaction,
  fromMacPack: null as null | fromMacPack,
  toMacPack: null as null | toMacPack
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
  },
    loadContract: async (args: {}) => {
    const { Mac } = await import(
          '../../contracts/build/src/Mac.js');
    state.Mac = Mac;
    const { Outcome, Preimage } = await import(
          '../../contracts/build/src/strpreim.js');
    state.Outcome = Outcome;
    state.Preimage = Preimage;
    const { fromMacPack, toMacPack } = await import(
        '../../contracts/build/src/helpers.js');
    state.fromMacPack = fromMacPack;
      state.toMacPack = toMacPack;
  },
  fetchBlockchainLength: async (args: {}) => {
    let block = await fetchLastBlock(
            "https://proxy.berkeley.minaexplorer.com/graphql");
    return block.blockchainLength.toJSON();
  },
  compileContract: async (args: {}) => {
    await state.Mac!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
    generatePrivateKey: async (args: {}) => {
        const privateKey: PrivateKey = PrivateKey.random();
        return privateKey.toBase58();
    },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
      state.zkapp = new state.Mac!(publicKey);
  },
    getBlockchainLength: async (args: {}) => {
        const network_state = await Mina.getNetworkState();
        return network_state.blockchainLength.toString();
    },
    deploy: async (args: { privateKey58: string }) => {
        const pk: PrivateKey = PrivateKey.fromBase58(args.privateKey58);
        await state.zkapp!.deploy(_commitment);
    },
    initialize: async (args: { commitment: string }) => {
        const _commitment: Field = Field.fromJSON(args.commitment);
        await state.zkapp!.initialize(_commitment);
    },
    fromMacPack: (args: { macpack: string }) => {
        state.preimage = state.fromMacPack(args.macpack);
    },
    toMacPack: (args: {}) => {
        return state.toMacPack(state.preimage);
    },
    definePreimage: (args: {
        address: string,
        employer: string,
        contractor: string,
        arbiter: string,
        contract_description: string,
        contract_outcome_deposit_description: string,
        contract_outcome_deposit_after: number,
        contract_outcome_deposit_before: number,
        contract_outcome_deposit_employer: number,
        contract_outcome_deposit_contractor: number,
        contract_outcome_deposit_arbiter: number,
        contract_outcome_success_description: string,
        contract_outcome_success_after: number,
        contract_outcome_success_before: number,
        contract_outcome_success_employer: number,
        contract_outcome_success_contractor: number,
        contract_outcome_success_arbiter: number,
        contract_outcome_failure_description: string,
        contract_outcome_failure_after: number,
        contract_outcome_failure_before: number,
        contract_outcome_failure_employer: number,
        contract_outcome_failure_contractor: number,
        contract_outcome_failure_arbiter: number,
        contract_outcome_cancel_description: string,
        contract_outcome_cancel_after: number,
        contract_outcome_cancel_before: number,
        contract_outcome_cancel_employer: number,
        contract_outcome_cancel_contractor: number,
        contract_outcome_cancel_arbiter: number
    }) => {
        const outcome_deposited: Outcome = new state.Outcome({
            description: CircuitString.fromString(args.contract_outcome_deposit_description),
            payment_employer: UInt64.from(args.contract_outcome_deposit_employer),
            payment_contractor: UInt64.from(args.contract_outcome_deposit_contractor),
            payment_arbiter: UInt64.from(args.contract_outcome_deposit_arbiter),
            start_after: UInt32.from(args.contract_outcome_deposit_after),
            finish_before: UInt32.from(args.contract_outcome_deposit_before)});

        const outcome_success: Outcome = new state.Outcome({
            description: CircuitString.fromString(args.contract_outcome_success_description),
            payment_employer: UInt64.from(args.contract_outcome_success_employer),
            payment_contractor: UInt64.from(args.contract_outcome_success_contractor),
            payment_arbiter: UInt64.from(args.contract_outcome_success_arbiter),
            start_after: UInt32.from(args.contract_outcome_success_after),
            finish_before: UInt32.from(args.contract_outcome_success_before)});

        const outcome_failure: Outcome = new state.Outcome({
            description: CircuitString.fromString(args.contract_outcome_failure_description),
            payment_employer: UInt64.from(args.contract_outcome_failure_employer),
            payment_contractor: UInt64.from(args.contract_outcome_failure_contractor),
            payment_arbiter: UInt64.from(args.contract_outcome_failure_arbiter),
            start_after: UInt32.from(args.contract_outcome_failure_after),
            finish_before: UInt32.from(args.contract_outcome_failure_before)});

        const outcome_cancel: Outcome = new state.Outcome({
            description: CircuitString.fromString(args.contract_outcome_cancel_description),
            payment_employer: UInt64.from(args.contract_outcome_cancel_employer),
            payment_contractor: UInt64.from(args.contract_outcome_cancel_contractor),
            payment_arbiter: UInt64.from(args.contract_outcome_cancel_arbiter),
            start_after: UInt32.from(args.contract_outcome_cancel_after),
            finish_before: UInt32.from(args.contract_outcome_cancel_before)});

        state.preimage = new state.Preimage({
            contract: CircuitString.fromString(args.contract_description),
            address: PublicKey.fromBase58(args.address),
            employer: PublicKey.fromBase58(args.employer),
            contractor: PublicKey.fromBase58(args.contractor),
            arbiter: PublicKey.fromBase58(args.arbiter),
            deposited: outcome_deposited,
            success: outcome_success,
            failure: outcome_failure,
            cancel: outcome_cancel});
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
