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

export function makeDummyPreimage(
  employer_sk: PrivateKey
): [
  Participant,
  Participant,
  Participant,
  Outcome,
  Outcome,
  Outcome,
  Outcome,
  Preimage
] {
  let employer: Participant,
    contractor: Participant,
    arbiter: Participant,
    outcome_deposited: Outcome,
    outcome_success: Outcome,
    outcome_failure: Outcome,
    outcome_cancel: Outcome,
    mac_contract: Preimage;

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
    new UInt64(12),
    new UInt64(6),
    new UInt64(6),
    new UInt64(0),
    new UInt64(0)
  );

  outcome_success = new Outcome(
    CircuitString.fromString('The contractor successfully did the job'),
    new UInt64(6),
    new UInt64(12),
    new UInt64(6),
    new UInt64(0),
    new UInt64(0)
  );

  outcome_failure = new Outcome(
    CircuitString.fromString('The contractor failed to do the job on time'),
    new UInt64(11),
    new UInt64(5),
    new UInt64(8),
    new UInt64(0),
    new UInt64(0)
  );

  outcome_cancel = new Outcome(
    CircuitString.fromString(
      'One of the parties decided to cancel the contract'
    ),
    new UInt64(12),
    new UInt64(6),
    new UInt64(6),
    new UInt64(0),
    new UInt64(0)
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

  return [
    employer,
    contractor,
    arbiter,
    outcome_deposited,
    outcome_success,
    outcome_failure,
    outcome_cancel,
    mac_contract,
  ];
}
