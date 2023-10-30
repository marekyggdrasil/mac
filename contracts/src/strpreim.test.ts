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
  Poseidon,
} from 'o1js';

import { Outcome, Preimage } from './strpreim';
import { makeDummyPreimage } from './strdummy';
import { fromMacPack, toMacPack } from './helpers';

describe('Preimage tests', () => {
  let employer: PublicKey,
    contractor: PublicKey,
    arbiter: PublicKey,
    outcome_deposited: Outcome,
    outcome_success: Outcome,
    outcome_failure: Outcome,
    outcome_cancel: Outcome,
    mac_contract: Preimage;

  let commitment: Field;

  let zkAppAddress: PublicKey, zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    await isReady;

    zkAppPrivateKey = PrivateKey.fromBase58(
      'EKDq4CzjuVc4vzYfFp1JW4oGhC7gnku1FupYqToo2r6YMDALoFiy'
    );
    zkAppAddress = zkAppPrivateKey.toPublicKey();

    const employer_sk: PrivateKey = PrivateKey.fromBase58(
      'EKEtj1bwZhqKccR3cDsoCwYWdzkaKaA6xyxiVhg3hMrNRREqX39h'
    );
    const contractor_sk: PrivateKey = PrivateKey.fromBase58(
      'EKFGwfgN6qiJN1usi5VnxUMvPsCWSdJUZryUEmBTHTCKicaXxCzG'
    );
    const arbiter_sk: PrivateKey = PrivateKey.fromBase58(
      'EKECauk9amNhhRHWSQtQRveHf4bF9WDbSbe656V9TQ8jRPJJdSyS'
    );

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

    commitment = Field(
      '3262985893969862402364762079656198465695636832664339061743215480471813876993'
    );
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('should compute hash commitment of a Preimage', () => {
    Preimage.hash(mac_contract).assertEquals(commitment);
  });

  it('should correctly import/export a whole contract using macpacs', () => {
    const macpack: string = toMacPack(mac_contract);
    console.log(macpack);
    const deserialized: Preimage = fromMacPack(macpack);
    expect(deserialized).toEqual(mac_contract);
  });
});
