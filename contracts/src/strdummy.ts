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
} from 'o1js';

import { Outcome, Preimage } from './preimage';

export function makeDummyPreimage(
  protocol_version: Field,
  format_version: Field,
  nonce: Field,
  employer_sk: PrivateKey,
  contractor_sk: PrivateKey,
  arbiter_sk: PrivateKey,
  zkAppAddress: PublicKey
): [
  PublicKey,
  PublicKey,
  PublicKey,
  Outcome,
  Outcome,
  Outcome,
  Outcome,
  Preimage,
] {
  let outcome_deposited: Outcome,
    outcome_success: Outcome,
    outcome_failure: Outcome,
    outcome_cancel: Outcome,
    mac_contract: Preimage;

  let employer: PublicKey = employer_sk.toPublicKey();
  let contractor: PublicKey = contractor_sk.toPublicKey();
  let arbiter: PublicKey = arbiter_sk.toPublicKey();

  outcome_deposited = new Outcome(
    CircuitString.fromString('Everyone deposited'),
    UInt64.from(12000000),
    UInt64.from(6000000),
    UInt64.from(6000000),
    UInt32.from(0),
    UInt32.from(5)
  );

  outcome_success = new Outcome(
    CircuitString.fromString('The contractor successfully did the job'),
    UInt64.from(5000000),
    UInt64.from(11000000),
    UInt64.from(8000000),
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
    protocol_version,
    format_version,
    nonce,
    CircuitString.fromString(
      'The contractor will do the job and arbiter will verify it'
    ),
    zkAppAddress,
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
