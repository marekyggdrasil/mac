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
  UInt32,
} from 'snarkyjs';

import { Participant, Outcome, Preimage } from './preimage';

export function makeDummyPreimage(
  employer_sk: PrivateKey,
  contractor_sk: PrivateKey,
  arbiter_sk: PrivateKey
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

  const contractor_pk: PublicKey = contractor_sk.toPublicKey();
  contractor = new Participant(contractor_pk);

  const arbiter_pk: PublicKey = arbiter_sk.toPublicKey();
  arbiter = new Participant(arbiter_pk);

  outcome_deposited = new Outcome(
    CircuitString.fromString(''),
    UInt64.from(12000000),
    UInt64.from(6000000),
    UInt64.from(6000000),
    UInt32.from(0),
    UInt32.from(5)
  );

  outcome_success = new Outcome(
    CircuitString.fromString('The contractor successfully did the job'),
    UInt64.from(6000000),
    UInt64.from(12000000),
    UInt64.from(6000000),
    UInt32.from(5),
    UInt32.from(15)
  );

  outcome_failure = new Outcome(
    CircuitString.fromString('The contractor failed to do the job on time'),
    UInt64.from(11000000),
    UInt64.from(5000000),
    UInt64.from(8000000),
    UInt32.from(15),
    UInt32.from(30)
  );

  outcome_cancel = new Outcome(
    CircuitString.fromString(
      'One of the parties decided to cancel the contract'
    ),
    UInt64.from(12000000),
    UInt64.from(6000000),
    UInt64.from(6000000),
    UInt32.from(0),
    UInt32.from(5)
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
