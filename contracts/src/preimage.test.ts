import {
  isReady,
  shutdown,
  Field,
  Circuit,
  CircuitString,
  PrivateKey,
  PublicKey,
} from 'snarkyjs';

import { Participant, Outcome, Preimage } from './preimage';

describe('hmmm', () => {
  beforeAll(async () => {
    await isReady;
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('some bs test to get started', () => {
    const employer_sk: PrivateKey = PrivateKey.random();
    const employer_pk: PublicKey = employer_sk.toPublicKey();
    const employer: Participant = new Participant(employer_pk);

    const contractor_sk: PrivateKey = PrivateKey.random();
    const contractor_pk: PublicKey = contractor_sk.toPublicKey();
    const contractor: Participant = new Participant(contractor_pk);

    const arbiter_sk: PrivateKey = PrivateKey.random();
    const arbiter_pk: PublicKey = arbiter_sk.toPublicKey();
    const arbiter: Participant = new Participant(arbiter_pk);

    const outcome_deposited: Outcome = new Outcome(
      CircuitString.fromString(''),
      new Field(12),
      new Field(6),
      new Field(6),
      new Field(-1),
      new Field(-1)
    );

    const outcome_success: Outcome = new Outcome(
      CircuitString.fromString('The contractor successfully did the job'),
      new Field(6),
      new Field(12),
      new Field(6),
      new Field(-1),
      new Field(-1)
    );

    const outcome_failure: Outcome = new Outcome(
      CircuitString.fromString('The contractor failed to do the job on time'),
      new Field(11),
      new Field(5),
      new Field(8),
      new Field(-1),
      new Field(-1)
    );

    const outcome_cancel: Outcome = new Outcome(
      CircuitString.fromString(
        'One of the parties decided to cancel the contract'
      ),
      new Field(12),
      new Field(6),
      new Field(6),
      new Field(-1),
      new Field(-1)
    );

    const mac_contract: Preimage = new Preimage(
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

    Circuit.runAndCheck(() => {
      const x = Circuit.witness(Field, () => new Field(5000));
      const y = Circuit.witness(Field, () => new Field(5000));
      x.assertEquals(y);
    });
  });
});
