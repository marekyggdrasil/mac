import {
  isReady,
  shutdown,
  Field,
  Circuit,
  PrivateKey,
  PublicKey,
} from 'snarkyjs';

import { Participant } from './preimage';

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

    Circuit.runAndCheck(() => {
      const x = Circuit.witness(Field, () => new Field(5000));
      const y = Circuit.witness(Field, () => new Field(5000));
      x.assertEquals(y);
    });
  });
});
