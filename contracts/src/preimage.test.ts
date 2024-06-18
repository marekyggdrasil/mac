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
} from 'o1js';

import { Participant, Outcome, Preimage } from './preimage';
import { makeDummyPreimage } from './dummy';

describe('Preimage tests', () => {
  let employer: Participant,
    contractor: Participant,
    arbiter: Participant,
    outcome_deposited: Outcome,
    outcome_success: Outcome,
    outcome_failure: Outcome,
    outcome_cancel: Outcome,
    mac_contract: Preimage;

  let zkAppAddress: PublicKey, zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    await isReady;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();

    const protocol_version: Field = Field.from(0);
    const format_version: Field = Field.from(0);

    const nonce: Field = Field.from(43872);
    const employer_sk: PrivateKey = PrivateKey.random();
    const contractor_sk: PrivateKey = PrivateKey.random();
    const arbiter_sk: PrivateKey = PrivateKey.random();
    [
      employer,
      contractor,
      arbiter,
      outcome_deposited,
      outcome_success,
      outcome_failure,
      outcome_cancel,
      mac_contract,
    ] = makeDummyPreimage(
      protocol_version,
      format_version,
      nonce,
      employer_sk,
      contractor_sk,
      arbiter_sk,
      zkAppAddress
    );
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('should correctly serialize/deserialize a participant to list of fields', () => {
    const serialized: Field[] = employer.serialize();
    const deserialized: Participant = Participant.deserialize(serialized);
    const [d, l]: [Participant, Field[]] =
      Participant.deserializeBuffer(serialized);
    expect(l.length).toEqual(0);
  });

  it('should correctly serialize/deserialize a participant to bytes', () => {
    const serialized: Uint8Array = employer.toBytes();
    const deserialized: Participant = Participant.fromBytes(serialized);
    expect(deserialized).toEqual(employer);
  });

  it('should correctly serialize/deserialize an outcome to list of fields', () => {
    const serialized: Field[] = outcome_success.serialize();
    const deserialized: Outcome = Outcome.deserialize(serialized);
    const [d, l]: [Outcome, Field[]] = Outcome.deserializeBuffer(serialized);
    expect(l.length).toEqual(0);
  });

  it('should correctly serialize/deserialize an outcome to bytes', () => {
    const sample: string = 'hello world hehe';
    const bytes_text: Uint8Array = Buffer.from(sample);
    const resample: string = Buffer.from(bytes_text).toString();
    expect(resample).toEqual(sample);

    const serialized: Uint8Array = outcome_success.toBytes();
    const deserialized: Outcome = Outcome.fromBytes(serialized);
    expect(deserialized).toEqual(outcome_success);
  });

  it('should correctly identify the participants by their keys', () => {
    Circuit.runAndCheck(() => {
      mac_contract.isEmployer(employer.pk()).assertEquals(Bool(true));
      mac_contract.isEmployer(contractor.pk()).assertEquals(Bool(false));
      mac_contract.isEmployer(arbiter.pk()).assertEquals(Bool(false));

      mac_contract.isContractor(employer.pk()).assertEquals(Bool(false));
      mac_contract.isContractor(contractor.pk()).assertEquals(Bool(true));
      mac_contract.isContractor(arbiter.pk()).assertEquals(Bool(false));

      mac_contract.isArbiter(employer.pk()).assertEquals(Bool(false));
      mac_contract.isArbiter(contractor.pk()).assertEquals(Bool(false));
      mac_contract.isArbiter(arbiter.pk()).assertEquals(Bool(true));

      mac_contract.isParty(employer.pk()).assertEquals(Bool(true));
      mac_contract.isParty(contractor.pk()).assertEquals(Bool(true));
      mac_contract.isParty(arbiter.pk()).assertEquals(Bool(true));
    });
  });

  it('should correctly serialize/deserialize a whole contract to bytes', () => {
    const serialized: Uint8Array = mac_contract.toBytes();
    const deserialized: Preimage = Preimage.fromBytes(serialized);
    expect(deserialized).toEqual(mac_contract);
  });

  it('should correctly import/export a whole contract using macpacs', () => {
    const macpack: string = mac_contract.getMacPack();
    const deserialized: Preimage = Preimage.fromMacPack(macpack);
    expect(deserialized).toEqual(mac_contract);
  });

  it('should be different based on nonce', () => {
    // same protocol and format versions
    const protocol_version: Field = Field.from(0);
    const format_version: Field = Field.from(0);

    // two difference nonce as Field
    const nonce_1: Field = Field.from(32874);
    const nonce_2: Field = Field.from(53782);

    let mac_contract_1: Preimage;
    let mac_contract_2: Preimage;

    const a_zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(
      'EKEqwTrRFNu6bwCWji4i6KgWWykvLKNimVKtK7ZTcDbubPrU5fV4'
    );
    const a_employer_sk: PrivateKey = PrivateKey.fromBase58(
      'EKECgFon1mMkVZwKRHXLtNSWNpiw22EagHED62P6n1usFmcMwbEo'
    );
    const a_contractor_sk: PrivateKey = PrivateKey.fromBase58(
      'EKEKR36hyKha55FLw1rFkEmjS9wo9cTWsog4mVZhP4ayYpUJBnnP'
    );
    const a_arbiter_sk: PrivateKey = PrivateKey.fromBase58(
      'EKEtxU8KYaRK8kRCLYLY9TVdbpYe91LnM6t3ipkvP6RcgHYcuy23'
    );

    const a_zkAppAddress: PublicKey = a_zkAppPrivateKey.toPublicKey();

    // we create two dummy preimages differing only by nonce
    [, , , , , , , mac_contract_1] = makeDummyPreimage(
      protocol_version,
      format_version,
      nonce_1,
      a_employer_sk,
      a_contractor_sk,
      a_arbiter_sk,
      a_zkAppAddress
    );
    [, , , , , , , mac_contract_2] = makeDummyPreimage(
      protocol_version,
      format_version,
      nonce_2,
      a_employer_sk,
      a_contractor_sk,
      a_arbiter_sk,
      a_zkAppAddress
    );

    // compute hashes / commitments of both preimages
    const commitment_1: Field = mac_contract_1.getCommitment();
    const commitment_2: Field = mac_contract_2.getCommitment();

    // confirm they are different values
    expect(commitment_1.toString()).toEqual(
      '10511020158907280664585139284625890160781169511257561805175734360310691487902'
    );
    expect(commitment_2.toString()).toEqual(
      '18542406340939338461686344541956570156058207043711948723273274632752591731193'
    );
  });
});
