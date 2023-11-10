import bs58 from 'bs58';
import * as byteify from 'byteify';

import { Field, CircuitString, PublicKey, UInt64, UInt32 } from 'o1js';

import { Outcome, Preimage } from './strpreim';

function Uint8ArrayToNumbers(input: Uint8Array): number[] {
  let t: number[] = [];
  for (let i = 0; i < input.length; ++i) {
    t.push(input[i]);
  }
  return t;
}

function bytesToMacPack(_bytes: Uint8Array): string {
  let encoded: string = bs58.encode(_bytes);

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

function MacPackToBytes(macpack: string): Uint8Array {
  let extracted: string = macpack.substring(
    macpack.indexOf('BEGINMACPACK.') + 13,
    macpack.lastIndexOf('. ENDMACPACK.')
  );
  extracted = extracted.replace(/[\n\r\s]/g, '');
  return bs58.decode(extracted);
}

function Uint8ArrayConcat(arrays: Uint8Array[]): Uint8Array {
  let t: number[] = [];
  for (let j = 0; j < arrays.length; ++j) {
    for (let i = 0; i < arrays[j].length; ++i) {
      t.push(arrays[j][i]);
    }
  }
  return new Uint8Array(t);
}

function outcomeToBytes(v: Outcome): Uint8Array {
  const bytes_text: Uint8Array = Buffer.from(v.description.toString());
  const bytes_text_length: Uint8Array = Uint8Array.from(
    byteify.serializeUint8(bytes_text.length)
  );
  const bytes_employer: Uint8Array = Uint8Array.from(
    byteify.serializeUint64(v.payment_employer.toBigInt())
  );
  const bytes_contractor: Uint8Array = Uint8Array.from(
    byteify.serializeUint64(v.payment_contractor.toBigInt())
  );
  const bytes_arbiter: Uint8Array = Uint8Array.from(
    byteify.serializeUint64(v.payment_arbiter.toBigInt())
  );
  const bytes_start_after: Uint8Array = Uint8Array.from(
    byteify.serializeUint64(v.start_after.toUInt64().toBigInt())
  );
  const bytes_finish_before: Uint8Array = Uint8Array.from(
    byteify.serializeUint64(v.finish_before.toUInt64().toBigInt())
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

function bytesToOutcome(_bytes: Uint8Array): Outcome {
  const payment_employer: UInt64 = UInt64.from(
    byteify.deserializeUint64(Uint8ArrayToNumbers(_bytes.slice(0, 8)))
  );
  const payment_contractor: UInt64 = UInt64.from(
    byteify.deserializeUint64(Uint8ArrayToNumbers(_bytes.slice(8, 16)))
  );
  const payment_arbiter: UInt64 = UInt64.from(
    byteify.deserializeUint64(Uint8ArrayToNumbers(_bytes.slice(16, 24)))
  );
  const start_after: UInt32 = UInt32.from(
    byteify.deserializeUint64(Uint8ArrayToNumbers(_bytes.slice(24, 32)))
  );
  const finish_before: UInt32 = UInt32.from(
    byteify.deserializeUint64(Uint8ArrayToNumbers(_bytes.slice(32, 40)))
  );

  const text_length: number = byteify.deserializeUint8(
    Uint8ArrayToNumbers(_bytes.slice(40, 41))
  );

  const text: string = Buffer.from(
    _bytes.slice(41, 41 + text_length)
  ).toString();
  const description: CircuitString = CircuitString.fromString(text);
  return new Outcome({
    description: description,
    payment_employer: payment_employer,
    payment_contractor: payment_contractor,
    payment_arbiter: payment_arbiter,
    start_after: start_after,
    finish_before: finish_before,
  });
}

function preimageToBytes(v: Preimage): Uint8Array {
  const deposited: Outcome = v.deposited;
  const success: Outcome = v.success;
  const failure: Outcome = v.failure;
  const cancel: Outcome = v.cancel;

  // protocol version and format version
  const bytes_header = Uint8Array.from([1, 1]); // contract version, format version

  const bytes_contract_text: Uint8Array = Buffer.from(v.contract.toString());

  const bytes_contract_text_length: Uint8Array = Uint8Array.from(
    byteify.serializeUint8(bytes_contract_text.length)
  );

  const bytes_address: Uint8Array = bs58.decode(v.address.toBase58());

  const bytes_employer: Uint8Array = bs58.decode(v.employer.toBase58());
  const bytes_contractor: Uint8Array = bs58.decode(v.contractor.toBase58());
  const bytes_arbiter: Uint8Array = bs58.decode(v.arbiter.toBase58());

  const bytes_deposited: Uint8Array = outcomeToBytes(deposited);
  const bytes_deposited_length: Uint8Array = Uint8Array.from(
    byteify.serializeUint8(bytes_deposited.length)
  );

  const bytes_success: Uint8Array = outcomeToBytes(success);
  const bytes_success_length: Uint8Array = Uint8Array.from(
    byteify.serializeUint8(bytes_success.length)
  );

  const bytes_failure: Uint8Array = outcomeToBytes(failure);
  const bytes_failure_length: Uint8Array = Uint8Array.from(
    byteify.serializeUint8(bytes_failure.length)
  );

  const bytes_cancel: Uint8Array = outcomeToBytes(cancel);
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

function bytesToPreimage(_bytes: Uint8Array): Preimage {
  // for now ignore the protocol version and format version and contract address...
  const address: PublicKey = PublicKey.fromBase58(
    bs58.encode(_bytes.slice(2, 42))
  );

  let i = 2 + 40;

  const employer: PublicKey = PublicKey.fromBase58(
    bs58.encode(_bytes.slice(i, i + 40))
  );
  i += 40;
  const contractor: PublicKey = PublicKey.fromBase58(
    bs58.encode(_bytes.slice(i, i + 40))
  );
  i += 40;
  const arbiter: PublicKey = PublicKey.fromBase58(
    bs58.encode(_bytes.slice(i, i + 40))
  );
  i += 40;

  let length: number = 0;

  length = byteify.deserializeUint8(
    Uint8ArrayToNumbers(_bytes.slice(i, i + 1))
  );
  i += 1;
  const outcome_deposited: Outcome = bytesToOutcome(
    _bytes.slice(i, i + length)
  );
  i += length;

  length = byteify.deserializeUint8(
    Uint8ArrayToNumbers(_bytes.slice(i, i + 1))
  );
  i += 1;
  const outcome_success: Outcome = bytesToOutcome(_bytes.slice(i, i + length));
  i += length;

  length = byteify.deserializeUint8(
    Uint8ArrayToNumbers(_bytes.slice(i, i + 1))
  );
  i += 1;
  const outcome_failure: Outcome = bytesToOutcome(_bytes.slice(i, i + length));
  i += length;

  length = byteify.deserializeUint8(
    Uint8ArrayToNumbers(_bytes.slice(i, i + 1))
  );
  i += 1;
  const outcome_cancel: Outcome = bytesToOutcome(_bytes.slice(i, i + length));
  i += length;

  length = byteify.deserializeUint8(
    Uint8ArrayToNumbers(_bytes.slice(i, i + 1))
  );
  i += 1;
  const contract: string = Buffer.from(_bytes.slice(i, i + length)).toString();

  return new Preimage({
    contract: CircuitString.fromString(contract),
    address: address,
    employer: employer,
    contractor: contractor,
    arbiter: arbiter,
    deposited: outcome_deposited,
    success: outcome_success,
    failure: outcome_failure,
    cancel: outcome_cancel,
  });
}

export function fromMacPack(macpack: string): Preimage {
  const _bytes: Uint8Array = MacPackToBytes(macpack);
  return bytesToPreimage(_bytes);
}

export function toMacPack(mac_contract: Preimage): string {
  const _bytes: Uint8Array = preimageToBytes(mac_contract);
  return bytesToMacPack(_bytes);
}
