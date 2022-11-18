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

  beforeEach(async () => {
    await isReady;

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
    ] = makeDummyPreimage(employer_sk, contractor_sk, arbiter_sk);
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('should correctly serialize/deserialize a participant', () => {
    const serialized: Field[] = employer.serialize();
    const deserialized: Participant = Participant.deserialize(serialized);
    const [d, l]: [Participant, Field[]] =
      Participant.deserializeBuffer(serialized);
    expect(l.length).toEqual(0);
  });

  it('should correctly serialize/deserialize an outcome', () => {
    const serialized: Field[] = outcome_success.serialize();
    const deserialized: Outcome = Outcome.deserialize(serialized);
    const [d, l]: [Outcome, Field[]] = Outcome.deserializeBuffer(serialized);
    expect(l.length).toEqual(0);
  });

  /*
  it('should correctly serialize/deserialize a whole contract', () => {
    const [serialized, contract_string]: [Field[], string] =
      mac_contract.serialize();
    const deserialized: Preimage = Preimage.deserialize(
      serialized,
      contract_string
    );
  });
  */

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
});
