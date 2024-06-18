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

  let commitment: Field;

  let zkAppAddress: PublicKey, zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    await isReady;
    const protocol_version: Field = Field.from(0);
    const format_version: Field = Field.from(0);
    const nonce: Field = Field.from(43872);

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
    ] = makeDummyPreimage(
      protocol_version,
      format_version,
      nonce,
      employer_sk,
      contractor_sk,
      arbiter_sk,
      zkAppAddress
    );

    commitment = Field(
      '19283366268175244124128055511224960666642359430760352707713842780859786748325'
    );
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('should compute hash commitment of a Preimage', () => {
    mac_contract.getCommitment().assertEquals(commitment);
  });

  it('should correctly import/export a whole contract using macpacs', () => {
    const macpack: string = mac_contract.getMacPack();
    console.log(macpack);
    const deserialized: Preimage = Preimage.fromMacPack(macpack);
    expect(deserialized).toEqual(mac_contract);
  });
});
