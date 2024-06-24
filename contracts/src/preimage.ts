import {
  Field,
  PublicKey,
  Struct,
  Circuit,
  CircuitString,
  Poseidon,
  UInt64,
  UInt32,
  Bool,
} from 'o1js';

import bs58 from 'bs58';
import * as byteify from 'byteify';

function bigIntTo32Bytes(bigInt: bigint): Uint8Array {
  const byteArray = new Uint8Array(32);
  for (let i = 31; i >= 0; i--) {
    byteArray[i] = Number(bigInt & BigInt(0xff));
    bigInt >>= BigInt(8);
  }
  return byteArray;
}

function bigintToByte(a: bigint) {
  return Number(a % BigInt(256));
}

function bytes32ToBigInt(byteArray: Uint8Array): bigint {
  if (byteArray.length !== 32) {
    throw new Error('Byte array must be exactly 32 bytes long');
  }
  let bigInt = BigInt(0);
  for (let i = 0; i < 32; i++) {
    bigInt = (bigInt << BigInt(8)) + BigInt(byteArray[i]);
  }
  return bigInt;
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

function Uint8ArrayToNumbers(input: Uint8Array): number[] {
  let t: number[] = [];
  for (let i = 0; i < input.length; ++i) {
    t.push(input[i]);
  }
  return t;
}

export class Participant extends Struct({
  participant_address: PublicKey,
}) {
  public pk(): PublicKey {
    return this.participant_address;
  }

  public serialize(): Field[] {
    return Participant.toFields(this);
  }

  static deserialize(serialized: Field[]): Participant {
    const deserialized: Participant = new Participant({
      participant_address: PublicKey.fromFields(serialized),
    });
    if (deserialized === null) {
      throw Error();
    }
    return deserialized;
  }

  static deserializeBuffer(serialized: Field[]): [Participant, Field[]] {
    const len: number = 2;
    const tot: number = serialized.length;
    const deserialized: Participant = Participant.deserialize(
      serialized.slice(0, len)
    );
    return [deserialized, serialized.slice(len, tot)];
  }

  public toBytes(): Uint8Array {
    const bytes = bs58.decode(this.participant_address.toBase58());
    return bytes;
  } // 40 bytes

  static fromBytes(bytes: Uint8Array): Participant {
    return new Participant({
      participant_address: PublicKey.fromBase58(bs58.encode(bytes)),
    });
  }
}

export class Outcome extends Struct({
  description: CircuitString,
  payment_employer: UInt64,
  payment_contractor: UInt64,
  payment_arbiter: UInt64,
  start_after: UInt32,
  finish_before: UInt32,
}) {
  public serialize(): Field[] {
    return Outcome.toFields(this);
  }

  public toBytes(): Uint8Array {
    const bytes_text: Uint8Array = Buffer.from(this.description.toString());
    const bytes_text_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_text.length)
    );
    const bytes_employer: Uint8Array = Uint8Array.from(
      byteify.serializeUint64(this.payment_employer.toBigInt())
    );
    const bytes_contractor: Uint8Array = Uint8Array.from(
      byteify.serializeUint64(this.payment_contractor.toBigInt())
    );
    const bytes_arbiter: Uint8Array = Uint8Array.from(
      byteify.serializeUint64(this.payment_arbiter.toBigInt())
    );
    const bytes_start_after: Uint8Array = Uint8Array.from(
      byteify.serializeUint64(this.start_after.toUInt64().toBigInt())
    );
    const bytes_finish_before: Uint8Array = Uint8Array.from(
      byteify.serializeUint64(this.finish_before.toUInt64().toBigInt())
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

  static fromBytes(bytes: Uint8Array): Outcome {
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
    return new Outcome({
      description: description,
      payment_employer: payment_employer,
      payment_contractor: payment_contractor,
      payment_arbiter: payment_arbiter,
      start_after: start_after,
      finish_before: finish_before,
    });
  }
}

export class Preimage extends Struct({
  protocol_version: Field,
  format_version: Field,
  nonce: Field,
  contract: CircuitString,
  address: PublicKey,
  employer: Participant,
  contractor: Participant,
  arbiter: Participant,
  deposited: Outcome,
  success: Outcome,
  failure: Outcome,
  cancel: Outcome,
  unresolved: Outcome,
}) {
  // identify the actor of the contract
  public isEmployer(actor: PublicKey): Bool {
    return actor.equals(this.employer.participant_address);
  }

  public isContractor(actor: PublicKey): Bool {
    return actor.equals(this.contractor.participant_address);
  }

  public isArbiter(actor: PublicKey): Bool {
    return actor.equals(this.arbiter.participant_address);
  }

  public isParty(actor: PublicKey): Bool {
    return this.isEmployer(actor)
      .or(this.isContractor(actor))
      .or(this.isArbiter(actor));
  }

  // state identification
  public isInitial(automaton_state: Field): Bool {
    return automaton_state.equals(Field(0)); // initial state
  }

  public isDeposit(automaton_state: Field): Bool {
    return automaton_state.equals(Field(1)); // deposit state
  }

  public isCanceled(automaton_state: Field): Bool {
    return automaton_state.equals(Field(2)); // canceled state
  }

  public isSuccess(automaton_state: Field): Bool {
    return automaton_state.equals(Field(3)); // success state
  }

  public isFailed(automaton_state: Field): Bool {
    return automaton_state.equals(Field(4)); // failed state
  }

  // handling the serialization
  public serialize(): Field[] {
    let serialized: Field[] = [
      this.protocol_version,
      this.format_version,
      this.nonce,
    ];
    serialized = serialized.concat(this.address.toFields());
    serialized = serialized.concat(this.employer.serialize());
    serialized = serialized.concat(this.contractor.serialize());
    serialized = serialized.concat(this.arbiter.serialize());
    serialized = serialized.concat(this.deposited.serialize());
    serialized = serialized.concat(this.success.serialize());
    serialized = serialized.concat(this.failure.serialize());
    serialized = serialized.concat(this.cancel.serialize());
    serialized = serialized.concat(this.unresolved.serialize());

    return serialized;
  }

  public getCommitment(): Field {
    const serialized: Field[] = this.serialize();
    serialized.concat(this.contract.hash());
    return Poseidon.hash(serialized);
  }

  public toBytes(): Uint8Array {
    const bytes_header = Uint8Array.from([
      bigintToByte(this.protocol_version.toBigInt()),
      bigintToByte(this.format_version.toBigInt()),
    ]);

    const bytes_nonce: Uint8Array = bigIntTo32Bytes(this.nonce.toBigInt());

    const bytes_contract_text: Uint8Array = Buffer.from(
      this.contract.toString()
    );

    const bytes_contract_text_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_contract_text.length)
    );

    const bytes_address: Uint8Array = bs58.decode(this.address.toBase58());

    const bytes_employer: Uint8Array = this.employer.toBytes();
    const bytes_contractor: Uint8Array = this.contractor.toBytes();
    const bytes_arbiter: Uint8Array = this.arbiter.toBytes();

    const bytes_deposited: Uint8Array = this.deposited.toBytes();
    const bytes_deposited_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_deposited.length)
    );

    const bytes_success: Uint8Array = this.success.toBytes();
    const bytes_success_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_success.length)
    );

    const bytes_failure: Uint8Array = this.failure.toBytes();
    const bytes_failure_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_failure.length)
    );

    const bytes_cancel: Uint8Array = this.cancel.toBytes();
    const bytes_cancel_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_cancel.length)
    );

    const bytes_unresolved: Uint8Array = this.unresolved.toBytes();
    const bytes_unresolved_length: Uint8Array = Uint8Array.from(
      byteify.serializeUint8(bytes_unresolved.length)
    );

    return Uint8ArrayConcat([
      bytes_header,
      bytes_nonce,
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
      bytes_unresolved_length,
      bytes_unresolved,
      bytes_contract_text_length,
      bytes_contract_text,
    ]);
  }

  static fromBytes(bytes: Uint8Array): Preimage {
    const protocol_version: Field = Field.from(bytes[0]);
    const format_version: Field = Field.from(bytes[1]);
    let start = 2 + 32;

    const nonce: Field = Field.from(bytes32ToBigInt(bytes.slice(2, 2 + 32)));

    let i = start + 40;
    const address: PublicKey = PublicKey.fromBase58(
      bs58.encode(bytes.slice(start, i))
    );

    const employer: Participant = Participant.fromBytes(bytes.slice(i, i + 40));
    i += 40;
    const contractor: Participant = Participant.fromBytes(
      bytes.slice(i, i + 40)
    );
    i += 40;
    const arbiter: Participant = Participant.fromBytes(bytes.slice(i, i + 40));
    i += 40;

    let length: number = 0;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_deposited: Outcome = Outcome.fromBytes(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_success: Outcome = Outcome.fromBytes(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_failure: Outcome = Outcome.fromBytes(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_cancel: Outcome = Outcome.fromBytes(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const outcome_unresolved: Outcome = Outcome.fromBytes(
      bytes.slice(i, i + length)
    );
    i += length;

    length = byteify.deserializeUint8(
      Uint8ArrayToNumbers(bytes.slice(i, i + 1))
    );
    i += 1;
    const contract: string = Buffer.from(bytes.slice(i, i + length)).toString();

    return new Preimage({
      protocol_version: protocol_version,
      format_version: format_version,
      nonce: nonce,
      contract: CircuitString.fromString(contract),
      address: address,
      employer: employer,
      contractor: contractor,
      arbiter: arbiter,
      deposited: outcome_deposited,
      success: outcome_success,
      failure: outcome_failure,
      cancel: outcome_cancel,
      unresolved: outcome_unresolved,
    });
  }

  // shareable contract
  public getMacPack(): string {
    const bytes: Uint8Array = this.toBytes();
    let encoded: string = bs58.encode(bytes);

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

  static fromMacPack(macpack: string): Preimage {
    let extracted: string = macpack.substring(
      macpack.indexOf('BEGINMACPACK.') + 13,
      macpack.lastIndexOf('. ENDMACPACK.')
    );
    extracted = extracted.replace(/[\n\r\s]/g, '');

    const bytes = bs58.decode(extracted);
    return this.fromBytes(bytes);
  }
}
