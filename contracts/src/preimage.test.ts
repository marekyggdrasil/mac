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
    const zkAppPrivateKey: PrivateKey = PrivateKey.random();
    const zkAppAddress: PublicKey = zkAppPrivateKey.toPublicKey();
    const participant: Participant = new Participant(zkAppAddress);

    Circuit.runAndCheck(() => {
      const x = Circuit.witness(Field, () => new Field(5000));
      const y = Circuit.witness(Field, () => new Field(5000));
      x.assertEquals(y);
    });
  });
});
