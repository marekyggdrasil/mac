import {
  isReady,
  shutdown,
  Bool,
  Field,
  Circuit,
  CircuitString,
  PrivateKey,
  PublicKey,
  UInt64,
} from 'snarkyjs';

import { Outcome, Preimage } from './strpreim';

function Uint8ArrayConcat(arrays: Uint8Array[]): Uint8Array {
  let t: number[] = [];
  for (let j = 0; j < arrays.length; ++j) {
    for (let i = 0; i < arrays[j].length; ++i) {
      t.push(arrays[j][i]);
    }
  }
  return new Uint8Array(t);
}

export function serializeOutcome(outcome: Outcome): Uint8Array {
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
