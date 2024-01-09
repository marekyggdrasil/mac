import {
  Mina,
  Cache,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  UInt32,
  UInt64,
  Bool,
  CircuitString,
  fetchLastBlock,
  AccountUpdate,
} from "o1js";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Mac } from "../../contracts/src/Mac";
import type { Outcome, Preimage } from "../../contracts/src/strpreim";
import type { fromMacPack, toMacPack } from "../../contracts/src/helpers";

import CompilationCacheJSONList from "./compilation_cache_list.json";

type zkAppWorkerState = {
  Mac: typeof Mac;
  Outcome: typeof Outcome;
  Preimage: typeof Preimage;
  zkapp: null | Mac;
  preimage: null | Preimage;
  transaction: null | Transaction;
  fromMacPack: typeof fromMacPack;
  toMacPack: typeof toMacPack;
};

type CompilationCacheJSONList = {
  files: string[]
}

function castPreimageValue(preimage: Preimage | null): Preimage {
  if (preimage === null) {
    throw Error("preimage value is null");
  }
  return preimage;
}

let state: null | zkAppWorkerState = null;

function fetchFiles() {
  const cache_list: CompilationCacheJSONList = CompilationCacheJSONList;
  return Promise.all(cache_list.files.map((file) => {
    return Promise.all([
      fetch(`http://localhost:3000/cache/${file}.header`).then(res => res.text()),
      fetch(`http://localhost:3000/cache/${file}`).then(res => res.text())
    ]).then(([header, data]) => ({ file, header, data }));
  }))
    .then((cacheList) => cacheList.reduce((acc: any, { file, header, data }) => {
      acc[file] = { file, header, data };
      return acc;
    }, {}));
}

const FileSystem = (files: any): Cache => ({
  read({ persistentId, uniqueId, dataType }: any) {
    // read current uniqueId, return data if it matches
    if (!files[persistentId]) {
      console.log('read');
      console.log({ persistentId, uniqueId, dataType });

      return undefined;
    }

    const currentId = files[persistentId].header;

    if (currentId !== uniqueId) {
      console.log('current id did not match persistent id');

      return undefined;
    }

    if (dataType === 'string') {
      console.log('found in cache', { persistentId, uniqueId, dataType });

      return new TextEncoder().encode(files[persistentId].data);
    }
    // else {
    //   let buffer = readFileSync(resolve(cacheDirectory, persistentId));
    //   return new Uint8Array(buffer.buffer);
    // }

    return undefined;
  },
  write({ persistentId, uniqueId, dataType }: any, data: any) {
    console.log('write');
    console.log({ persistentId, uniqueId, dataType });
  },
  canWrite: true,
});

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToNetwork: async (args: { endpoint: string }) => {
    const connection = Mina.BerkeleyQANet(args.endpoint);
    Mina.setActiveInstance(connection);
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet(
      "https://proxy.berkeley.minaexplorer.com/graphql",
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Mac } = await import("../../contracts/build/Mac.js");
    if (Mac === null) {
      throw Error("Mac type is null");
    }
    const { Outcome, Preimage } = await import(
      "../../contracts/build/strpreim.js"
    );
    if (Outcome === null) {
      throw Error("Outcome type is null");
    }
    if (Preimage === null) {
      throw Error("Preimage type is null");
    }
    const { fromMacPack, toMacPack } = await import(
      "../../contracts/build/helpers.js"
    );
    state = {
      Mac: Mac,
      Outcome: Outcome,
      Preimage: Preimage,
      zkapp: null,
      preimage: null,
      transaction: null,
      fromMacPack: fromMacPack,
      toMacPack: toMacPack,
    };
    state.fromMacPack = fromMacPack;
    state.toMacPack = toMacPack;
  },
  fetchBlockchainLength: async (args: {}) => {
    let block = await fetchLastBlock(
      "https://proxy.berkeley.minaexplorer.com/graphql",
    );
    return block.blockchainLength.toJSON();
  },
  compileContract: async (args: {}) => {
    if (state === null) {
      throw Error("state is null");
    }
    const cacheFiles = await fetchFiles();
    await state.Mac!.compile({ cache: FileSystem(cacheFiles) });
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
    if (state === null) {
      throw Error("state is null");
    }
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Mac!(publicKey);
  },
  getBlockchainLength: async (args: {}) => {
    try {
      const network_state = await Mina.getNetworkState();
      return network_state.blockchainLength.toString();
    } catch (e: unknown) {
      throw Error("nope!");
    }
  },
  createDeployTransaction: async (args: {
    zkAppPrivateKey58: string;
    feePayerAddress58: string;
  }) => {
    if (state === null) {
      throw Error("state is null");
    }
    if (state.preimage === null) {
      throw Error("state.preimage is null");
    }
    const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(
      args.zkAppPrivateKey58,
    );
    const feePayer: PublicKey = PublicKey.fromBase58(args.feePayerAddress58);
    let transactionFee = 100_000_000;
    const _commitment: Field = state.Preimage.hash(state.preimage);
    const transaction = await Mina.transaction(
      { sender: feePayer, fee: transactionFee },
      () => {
        if (state === null) {
          throw Error("state is null");
        }
        AccountUpdate.fundNewAccount(feePayer);
        state.zkapp!.deploy({ zkappKey: zkAppPrivateKey });
        state.zkapp!.initialize(_commitment);
      },
    );
    transaction.sign([zkAppPrivateKey]);
    state.transaction = transaction;
  },
  createDepositTransaction: async (args: { actorPublicKey58: string }) => {
    if (state === null) {
      throw Error("state is null");
    }
    const feePayer: PublicKey = PublicKey.fromBase58(args.actorPublicKey58);
    let transactionFee = 100_000_000;
    const transaction = await Mina.transaction(
      { sender: feePayer, fee: transactionFee },
      () => {
        if (state === null) {
          throw Error("state is null");
        }
        if (state.preimage === null) {
          throw Error("state.preimage is null");
        }
        state.zkapp!.deposit(state.preimage, feePayer);
      },
    );
    state.transaction = transaction;
  },
  createWithdrawTransaction: async (args: { actorPublicKey58: string }) => {
    if (state === null) {
      throw Error("state is null");
    }
    const feePayer: PublicKey = PublicKey.fromBase58(args.actorPublicKey58);
    let transactionFee = 100_000_000;
    const transaction = await Mina.transaction(
      { sender: feePayer, fee: transactionFee },
      () => {
        if (state === null) {
          throw Error("state is null");
        }
        if (state.preimage === null) {
          throw Error("state.preimage is null");
        }
        state.zkapp!.withdraw(state.preimage, feePayer);
      },
    );
    state.transaction = transaction;
  },
  createSuccessTransaction: async (args: { actorPublicKey58: string }) => {
    if (state === null) {
      throw Error("state is null");
    }
    const feePayer: PublicKey = PublicKey.fromBase58(args.actorPublicKey58);
    let transactionFee = 100_000_000;
    const transaction = await Mina.transaction(
      { sender: feePayer, fee: transactionFee },
      () => {
        if (state === null) {
          throw Error("state is null");
        }
        if (state.preimage === null) {
          throw Error("state.preimage is null");
        }
        state.zkapp!.success(state.preimage, feePayer);
      },
    );
    state.transaction = transaction;
  },
  createFailureTransaction: async (args: { actorPublicKey58: string }) => {
    if (state === null) {
      throw Error("state is null");
    }
    const feePayer: PublicKey = PublicKey.fromBase58(args.actorPublicKey58);
    let transactionFee = 100_000_000;
    const transaction = await Mina.transaction(
      { sender: feePayer, fee: transactionFee },
      () => {
        if (state === null) {
          throw Error("state is null");
        }
        if (state.preimage === null) {
          throw Error("state.preimage is null");
        }
        state.zkapp!.failure(state.preimage, feePayer);
      },
    );
    state.transaction = transaction;
  },
  createCancelTransaction: async (args: { actorPublicKey58: string }) => {
    if (state === null) {
      throw Error("state is null");
    }
    const feePayer: PublicKey = PublicKey.fromBase58(args.actorPublicKey58);
    let transactionFee = 100_000_000;
    const transaction = await Mina.transaction(
      { sender: feePayer, fee: transactionFee },
      () => {
        if (state === null) {
          throw Error("state is null");
        }
        if (state.preimage === null) {
          throw Error("state.preimage is null");
        }
        state.zkapp!.cancel(state.preimage, feePayer);
      },
    );
    state.transaction = transaction;
  },
  getContractState: async (args: {}) => {
    if (state === null) {
      throw Error("state is null");
    }
    const automaton_state: Field = await state.zkapp!.automaton_state.get();
    const memory: Field = await state.zkapp!.memory.get();
    const actions: Bool[] = memory.toBits(3);
    let st = "initial";
    switch (parseInt(automaton_state.toString())) {
      case 0:
        st = "initial";
        break;
      case 1:
        st = "deposited";
        break;
      case 2:
        st = "canceled_early";
        break;
      case 3:
        st = "canceled";
        break;
      case 4:
        st = "succeeded";
        break;
      case 5:
        st = "failed";
        break;
      default:
        st = "unknown";
        break;
    }
    return JSON.stringify({
      acted: {
        employer: actions[2].toBoolean(),
        contractor: actions[1].toBoolean(),
        arbiter: actions[0].toBoolean(),
      },
      automaton_state: st,
    });
  },
  fromMacPack: (args: { macpack: string }) => {
    if (state === null) {
      throw Error("state is null");
    }
    state.preimage = state.fromMacPack(args.macpack);
  },
  toMacPack: (args: {}) => {
    if (state === null) {
      throw Error("state is null");
    }
    return state.toMacPack(castPreimageValue(state.preimage));
  },
  getPreimageData: (args: {}) => {
    if (state === null) {
      throw Error("state is null");
    }
    if (state.preimage === null) {
      throw Error("Preimage is null");
    }
    return JSON.stringify({
      address: state.preimage.address.toBase58(),
      employer: state.preimage.employer.toBase58(),
      contractor: state.preimage.contractor.toBase58(),
      arbiter: state.preimage.arbiter.toBase58(),
      contract_description: state.preimage.contract.toString(),
      contract_outcome_deposit_description:
        state.preimage.deposited.description.toString(),
      contract_outcome_deposit_after: parseInt(
        state.preimage.deposited.start_after.toString(),
      ),
      contract_outcome_deposit_before: parseInt(
        state.preimage.deposited.finish_before.toString(),
      ),
      contract_outcome_deposit_employer: parseInt(
        state.preimage.deposited.payment_employer.toString(),
      ),
      contract_outcome_deposit_contractor: parseInt(
        state.preimage.deposited.payment_contractor.toString(),
      ),
      contract_outcome_deposit_arbiter: parseInt(
        state.preimage.deposited.payment_arbiter.toString(),
      ),
      contract_outcome_success_description:
        state.preimage.success.description.toString(),
      contract_outcome_success_after: parseInt(
        state.preimage.success.start_after.toString(),
      ),
      contract_outcome_success_before: parseInt(
        state.preimage.success.finish_before.toString(),
      ),
      contract_outcome_success_employer: parseInt(
        state.preimage.success.payment_employer.toString(),
      ),
      contract_outcome_success_contractor: parseInt(
        state.preimage.success.payment_contractor.toString(),
      ),
      contract_outcome_success_arbiter: parseInt(
        state.preimage.success.payment_arbiter.toString(),
      ),
      contract_outcome_failure_description:
        state.preimage.failure.description.toString(),
      contract_outcome_failure_after: parseInt(
        state.preimage.failure.start_after.toString(),
      ),
      contract_outcome_failure_before: parseInt(
        state.preimage.failure.finish_before.toString(),
      ),
      contract_outcome_failure_employer: parseInt(
        state.preimage.failure.payment_employer.toString(),
      ),
      contract_outcome_failure_contractor: parseInt(
        state.preimage.failure.payment_contractor.toString(),
      ),
      contract_outcome_failure_arbiter: parseInt(
        state.preimage.failure.payment_arbiter.toString(),
      ),
      contract_outcome_cancel_description:
        state.preimage.cancel.description.toString(),
      contract_outcome_cancel_after: parseInt(
        state.preimage.cancel.start_after.toString(),
      ),
      contract_outcome_cancel_before: parseInt(
        state.preimage.cancel.finish_before.toString(),
      ),
      contract_outcome_cancel_employer: parseInt(
        state.preimage.cancel.payment_employer.toString(),
      ),
      contract_outcome_cancel_contractor: parseInt(
        state.preimage.cancel.payment_contractor.toString(),
      ),
      contract_outcome_cancel_arbiter: parseInt(
        state.preimage.cancel.payment_arbiter.toString(),
      ),
    });
  },
  definePreimage: (args: {
    address: string;
    employer: string;
    contractor: string;
    arbiter: string;
    contract_description: string;
    contract_outcome_deposit_description: string;
    contract_outcome_deposit_after: number;
    contract_outcome_deposit_before: number;
    contract_outcome_deposit_employer: number;
    contract_outcome_deposit_contractor: number;
    contract_outcome_deposit_arbiter: number;
    contract_outcome_success_description: string;
    contract_outcome_success_after: number;
    contract_outcome_success_before: number;
    contract_outcome_success_employer: number;
    contract_outcome_success_contractor: number;
    contract_outcome_success_arbiter: number;
    contract_outcome_failure_description: string;
    contract_outcome_failure_after: number;
    contract_outcome_failure_before: number;
    contract_outcome_failure_employer: number;
    contract_outcome_failure_contractor: number;
    contract_outcome_failure_arbiter: number;
    contract_outcome_cancel_description: string;
    contract_outcome_cancel_after: number;
    contract_outcome_cancel_before: number;
    contract_outcome_cancel_employer: number;
    contract_outcome_cancel_contractor: number;
    contract_outcome_cancel_arbiter: number;
  }) => {
    if (state === null) {
      throw Error("state is null");
    }
    const outcome_deposited: Outcome = new state.Outcome({
      description: CircuitString.fromString(
        args.contract_outcome_deposit_description,
      ),
      payment_employer: UInt64.from(args.contract_outcome_deposit_employer),
      payment_contractor: UInt64.from(args.contract_outcome_deposit_contractor),
      payment_arbiter: UInt64.from(args.contract_outcome_deposit_arbiter),
      start_after: UInt32.from(args.contract_outcome_deposit_after),
      finish_before: UInt32.from(args.contract_outcome_deposit_before),
    });

    const outcome_success: Outcome = new state.Outcome({
      description: CircuitString.fromString(
        args.contract_outcome_success_description,
      ),
      payment_employer: UInt64.from(args.contract_outcome_success_employer),
      payment_contractor: UInt64.from(args.contract_outcome_success_contractor),
      payment_arbiter: UInt64.from(args.contract_outcome_success_arbiter),
      start_after: UInt32.from(args.contract_outcome_success_after),
      finish_before: UInt32.from(args.contract_outcome_success_before),
    });

    const outcome_failure: Outcome = new state.Outcome({
      description: CircuitString.fromString(
        args.contract_outcome_failure_description,
      ),
      payment_employer: UInt64.from(args.contract_outcome_failure_employer),
      payment_contractor: UInt64.from(args.contract_outcome_failure_contractor),
      payment_arbiter: UInt64.from(args.contract_outcome_failure_arbiter),
      start_after: UInt32.from(args.contract_outcome_failure_after),
      finish_before: UInt32.from(args.contract_outcome_failure_before),
    });

    const outcome_cancel: Outcome = new state.Outcome({
      description: CircuitString.fromString(
        args.contract_outcome_cancel_description,
      ),
      payment_employer: UInt64.from(args.contract_outcome_cancel_employer),
      payment_contractor: UInt64.from(args.contract_outcome_cancel_contractor),
      payment_arbiter: UInt64.from(args.contract_outcome_cancel_arbiter),
      start_after: UInt32.from(args.contract_outcome_cancel_after),
      finish_before: UInt32.from(args.contract_outcome_cancel_before),
    });

    state.preimage = new state.Preimage({
      contract: CircuitString.fromString(args.contract_description),
      address: PublicKey.fromBase58(args.address),
      employer: PublicKey.fromBase58(args.employer),
      contractor: PublicKey.fromBase58(args.contractor),
      arbiter: PublicKey.fromBase58(args.arbiter),
      deposited: outcome_deposited,
      success: outcome_success,
      failure: outcome_failure,
      cancel: outcome_cancel,
    });
  },
  proveTransaction: async (args: {}) => {
    if (state === null) {
      throw Error("state is null");
    }
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    if (state === null) {
      throw Error("state is null");
    }
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (process.browser) {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    },
  );
}
