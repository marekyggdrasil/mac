import {
  Bool,
  Field,
  Circuit,
  CircuitString,
  PrivateKey,
  PublicKey,
  UInt64,
  UInt32,
} from 'o1js';

import { Participant, Outcome, Preimage } from './preimage';

export function makeDummyPreimage(
  protocol_version: Field,
  format_version: Field,
  nonce: Field,
  employer_sk: PrivateKey,
  contractor_sk: PrivateKey,
  arbiter_sk: PrivateKey,
  zkAppAddress: PublicKey
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
    outcome_unresolved: Outcome,
    mac_contract: Preimage;

  const employer_pk: PublicKey = employer_sk.toPublicKey();
  employer = new Participant({ participant_address: employer_pk });

  const contractor_pk: PublicKey = contractor_sk.toPublicKey();
  contractor = new Participant({ participant_address: contractor_pk });

  const arbiter_pk: PublicKey = arbiter_sk.toPublicKey();
  arbiter = new Participant({ participant_address: arbiter_pk });

  outcome_deposited = new Outcome({
    description: CircuitString.fromString(''),
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

  outcome_unresolved = new Outcome({
    description: CircuitString.fromString('The arbiter did not act at all'),
    payment_employer: UInt64.from(12000000),
    payment_contractor: UInt64.from(6000000),
    payment_arbiter: UInt64.from(6000000),
    start_after: UInt32.from(31),
    finish_before: UInt32.from(99),
  });

  mac_contract = new Preimage({
    protocol_version: protocol_version,
    format_version: format_version,
    nonce: nonce,
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
    unresolved: outcome_unresolved,
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
