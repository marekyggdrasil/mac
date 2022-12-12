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

import { Outcome, Preimage } from './strpreim';

export function makeDummyPreimage(
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
  Preimage
] {
  let outcome_deposited: Outcome,
    outcome_success: Outcome,
    outcome_failure: Outcome,
    outcome_cancel: Outcome,
    mac_contract: Preimage;

  let employer: PublicKey = employer_sk.toPublicKey();
  let contractor: PublicKey = contractor_sk.toPublicKey();
  let arbiter: PublicKey = arbiter_sk.toPublicKey();

  outcome_deposited = new Outcome({
    description: CircuitString.fromString('Everyone deposited'),
    payment_employer: UInt64.from(12000000),
    payment_contractor: UInt64.from(6000000),
    payment_arbiter: UInt64.from(6000000),
    start_after: UInt32.from(0),
    finish_before: UInt32.from(5),
  });

  outcome_success = new Outcome({
    description: CircuitString.fromString(
      'The contractor successfully did the job'
    ),
    payment_employer: UInt64.from(5000000),
    payment_contractor: UInt64.from(11000000),
    payment_arbiter: UInt64.from(8000000),
    start_after: UInt32.from(5),
    finish_before: UInt32.from(15),
  });

  outcome_failure = new Outcome({
    description: CircuitString.fromString(
      'The contractor failed to do the job on time'
    ),
    payment_employer: UInt64.from(11000000),
    payment_contractor: UInt64.from(5000000),
    payment_arbiter: UInt64.from(8000000),
    start_after: UInt32.from(15),
    finish_before: UInt32.from(30),
  });

  outcome_cancel = new Outcome({
    description: CircuitString.fromString(
      'One of the parties decided to cancel the contract'
    ),
    payment_employer: UInt64.from(12000000),
    payment_contractor: UInt64.from(6000000),
    payment_arbiter: UInt64.from(6000000),
    start_after: UInt32.from(0),
    finish_before: UInt32.from(5),
  });

  mac_contract = new Preimage({
    contract: CircuitString.fromString(
      'The contractor will do the job and arbiter will verify it'
    ),
    address: zkAppAddress,
    employer: employer,
    contractor: contractor,
    arbiter: arbiter,
    deposited: outcome_deposited,
    success: outcome_success,
    failure: outcome_failure,
    cancel: outcome_cancel,
  });

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
