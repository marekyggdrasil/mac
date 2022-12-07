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
    ] = makeDummyPreimage(employer_sk, contractor_sk, arbiter_sk, zkAppAddress);
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
});
