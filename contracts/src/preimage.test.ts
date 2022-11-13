import {
  isReady,
  shutdown,
  Bool,
  Field,
  Circuit,
  CircuitString,
  PrivateKey,
  PublicKey,
} from 'snarkyjs';

import { Participant, Outcome, Preimage } from './preimage';

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
    const employer_pk: PublicKey = employer_sk.toPublicKey();
    employer = new Participant(employer_pk);

    const contractor_sk: PrivateKey = PrivateKey.random();
    const contractor_pk: PublicKey = contractor_sk.toPublicKey();
    contractor = new Participant(contractor_pk);

    const arbiter_sk: PrivateKey = PrivateKey.random();
    const arbiter_pk: PublicKey = arbiter_sk.toPublicKey();
    arbiter = new Participant(arbiter_pk);

    outcome_deposited = new Outcome(
      CircuitString.fromString(''),
      new Field(12),
      new Field(6),
      new Field(6),
      new Field(-1),
      new Field(-1)
    );

    outcome_success = new Outcome(
      CircuitString.fromString('The contractor successfully did the job'),
      new Field(6),
      new Field(12),
      new Field(6),
      new Field(-1),
      new Field(-1)
    );

    outcome_failure = new Outcome(
      CircuitString.fromString('The contractor failed to do the job on time'),
      new Field(11),
      new Field(5),
      new Field(8),
      new Field(-1),
      new Field(-1)
    );

    outcome_cancel = new Outcome(
      CircuitString.fromString(
        'One of the parties decided to cancel the contract'
      ),
      new Field(12),
      new Field(6),
      new Field(6),
      new Field(-1),
      new Field(-1)
    );

    mac_contract = new Preimage(
      CircuitString.fromString(
        'The contractor will do the job and arbiter will verify it'
      ),
      employer,
      contractor,
      arbiter,
      outcome_deposited,
      outcome_success,
      outcome_failure,
      outcome_cancel
    );
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

  it('should correctly serialize/deserialize a whole contract', () => {
    const [serialized, contract_string]: [Field[], string] =
      mac_contract.serialize();
    const deserialized: Preimage = Preimage.deserialize(
      serialized,
      contract_string
    );
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
});
