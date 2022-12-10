import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  UInt32,
  UInt64,
  CircuitString
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Mac } from '../../contracts/src/Mac';
import type { Participant, Outcome, Preimage } from '../../contracts/src/preimage';

import bs58 from 'bs58';
import byteify from 'byteify';

const state = {
  Mac: null as null | typeof Mac,
  zkapp: null as null | Mac,
  transaction: null as null | Transaction,
  preimage: null as null | Preimage,
}

// ---------------------------------------------------------------------------------------

function Uint8ArrayConcat(arrays: Uint8Array[]): Uint8Array {
    let t: number[] = [];
    for (let j = 0; j < arrays.length; ++j) {
        for (let i = 0; i < arrays[j].length; ++i) {
            t.push(arrays[j][i]);
        }
    }
    return new Uint8Array(t);
}

function Uint8ArrayToNumbers(input: Uint8Array): number[] {
    let t: number[] = [];
    for (let i = 0; i < input.length; ++i) {
        t.push(input[i]);
    }
    return t;
}

function ParticipantToUint8Array(participant: Participant): Uint8Array {
    return bs58.decode(participant.participant_address.toBase58());
}

function Uint8ArrayToParticipant(bytes: Uint8Array): Participant {
    return new Participant(PublicKey.fromBase58(bs58.encode(bytes)));
}

function OutcomeToUint8Array(outcome: Outcome): Uint8Array {
    const bytes_text: Uint8Array = Buffer.from(outcome.description.toString());
    const bytes_text_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_text.length)
    );
    const bytes_employer: Uint8Array = Uint8Array.from(
        byteify.serializeUint64(outcome.payment_employer.toBigInt())
    );
    const bytes_contractor: Uint8Array = Uint8Array.from(
        byteify.serializeUint64(outcome.payment_contractor.toBigInt())
    );
    const bytes_arbiter: Uint8Array = Uint8Array.from(
        byteify.serializeUint64(outcome.payment_arbiter.toBigInt())
    );
    const bytes_start_after: Uint8Array = Uint8Array.from(
        byteify.serializeUint64(outcome.start_after.toUInt64().toBigInt())
    );
    const bytes_finish_before: Uint8Array = Uint8Array.from(
        byteify.serializeUint64(outcome.finish_before.toUInt64().toBigInt())
    );
    return Uint8ArrayConcat([
      bytes_employer,
      bytes_contractor,
      bytes_arbiter,
      bytes_start_after,
      bytes_finish_before,
      bytes_text_length,
      bytes_text,
    ]);
}

function Uint8ArrayToOutcome(bytes: Uint8Array): Outcome {
    const payment_employer: UInt64 = UInt64.from(
      byteify.deserializeUint64(Uint8ArrayToNumbers(bytes.slice(0, 8)))
    );
    const payment_contractor: UInt64 = UInt64.from(
      byteify.deserializeUint64(Uint8ArrayToNumbers(bytes.slice(8, 16)))
    );
    const payment_arbiter: UInt64 = UInt64.from(
      byteify.deserializeUint64(Uint8ArrayToNumbers(bytes.slice(16, 24)))
    );
    const start_after: UInt32 = UInt32.from(
      byteify.deserializeUint64(Uint8ArrayToNumbers(bytes.slice(24, 32)))
    );
    const finish_before: UInt32 = UInt32.from(
      byteify.deserializeUint64(Uint8ArrayToNumbers(bytes.slice(32, 40)))
    );

    const text_length: number = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(40, 41))
    );

    const text: string = Buffer.from(
      bytes.slice(41, 41 + text_length)
    ).toString();
    const description: CircuitString = CircuitString.fromString(text);
    return new Outcome(
      description,
      payment_employer,
      payment_contractor,
      payment_arbiter,
      start_after,
      finish_before
    );
}

function PreimageToUint8Array(preimage: Preimage): Uint8Array {
    // protocol version and format version
    const bytes_header = Uint8Array.from([1, 1]); // contract version, format version

    const bytes_contract_text: Uint8Array = Buffer.from(
      this.contract.toString()
    );

    const bytes_contract_text_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_contract_text.length)
    );

    const bytes_address: Uint8Array = bs58.decode(preimage.address.toBase58());

    const bytes_employer: Uint8Array = ParticipantToUint8Array(preimage.employer);
    const bytes_contractor: Uint8Array = ParticipantToUint8Array(preimage.contractor);
    const bytes_arbiter: Uint8Array = ParticipantToUint8Array(preimage.arbiter);

    const bytes_deposited: Uint8Array = OutcomeToUint8Array(preimage.deposited);
    const bytes_deposited_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_deposited.length)
    );

    const bytes_success: Uint8Array = OutcomeToUint8Array(preimage.success);
    const bytes_success_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_success.length)
    );

    const bytes_failure: Uint8Array = OutcomeToUint8Array(preimage.failure);
    const bytes_failure_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_failure.length)
    );

    const bytes_cancel: Uint8Array = OutcomeToUint8Array(preimage.cancel);
    const bytes_cancel_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_cancel.length)
    );

    return Uint8ArrayConcat([
      bytes_header,
      bytes_address,
      bytes_employer,
      bytes_contractor,
      bytes_arbiter,
      bytes_deposited_length,
      bytes_deposited,
      bytes_success_length,
      bytes_success,
      bytes_failure_length,
      bytes_failure,
      bytes_cancel_length,
      bytes_cancel,
      bytes_contract_text_length,
      bytes_contract_text,
    ]);
}

function Uint8ArrayToPreimage(bytes: Uint8Array): Preimage {
    // for now ignore the protocol version and format version and contract address...
    const address: PublicKey = PublicKey.fromBase58(
      bs58.encode(bytes.slice(2, 42))
    );

    let i = 2 + 40;

    const employer: Participant = Uint8ArrayToParticipant(bytes.slice(i, i + 40));
    i += 40;
    const contractor: Participant = Uint8ArrayToParticipant(bytes.slice(i, i + 40));
    i += 40;
    const arbiter: Participant = Uint8ArrayToParticipant(bytes.slice(i, i + 40));
    i += 40;

    let length: number = 0;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_deposited: Outcome = Uint8ArrayToOutcome(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_success: Outcome = Uint8ArrayToOutcome(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_failure: Outcome = Uint8ArrayToOutcome(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_cancel: Outcome = Uint8ArrayToOutcome(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const contract: string = Buffer.from(bytes.slice(i, i + length)).toString();

    return new Preimage(
      CircuitString.fromString(contract),
      address,
      employer,
      contractor,
      arbiter,
      outcome_deposited,
      outcome_success,
      outcome_failure,
      outcome_cancel
    );
}

function PreimageToMacPack(preimage: Preimage): string {
    let encoded: string = bs58.encode(PreimageToUint8Array(preimage));

    const wordlen: number = 13; // number of characters per word
    const linelen: number = 4; // number of words per line
    // console.log(encoded.match(/.{1,13}/g));

    let macpack: string = 'BEGINMACPACK.';
    let line: number = 1;

    while (encoded.length > 0) {
        let word: string = '';
        if (encoded.length < wordlen) {
            word = encoded;
            encoded = '';
        } else {
            word = encoded.slice(0, wordlen);
            encoded = encoded.slice(13, encoded.length);
        }
        if (line < linelen) {
            macpack += ' ' + word;
            line += 1;
        } else {
            line = 1;
            macpack += '\n' + word;
        }
    }

    macpack += '. ENDMACPACK.';
    return macpack.toString();
}

function MacPackToPreimage(macpack: string): Preimage {
    let extracted: string = macpack.substring(
        macpack.indexOf('BEGINMACPACK.') + 13,
        macpack.lastIndexOf('. ENDMACPACK.')
    );
    extracted = extracted.replace(/[\n\r\s]/g, '');

    return Uint8ArrayToPreimage(bs58.decode(extracted));
}

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
  },
  loadContract: async (args: {}) => {
      const { Mac } = await import('../../contracts/build/src/Mac.js');
      state.Mac = Mac;
  },
  compileContract: async (args: {}) => {
      await state.Mac!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
      const publicKey = PublicKey.fromBase58(args.publicKey58);
      const p: Participant = new Participant(publicKey);
      console.log(p);
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
        state.preimage = MacPackToPreimage(args.macpack);
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
