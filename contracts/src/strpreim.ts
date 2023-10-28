import {
  Field,
  PublicKey,
  CircuitString,
  Poseidon,
  UInt64,
  UInt32,
  Bool,
  Struct,
} from 'o1js';

export class Outcome extends Struct({
  description: CircuitString,
  payment_employer: UInt64,
  payment_contractor: UInt64,
  payment_arbiter: UInt64,
  start_after: UInt32,
  finish_before: UInt32,
}) {
  static hash(v: Outcome): Field {
    return Poseidon.hash(
      v.description
        .toFields()
        .concat(
          v.payment_employer.toFields(),
          v.payment_contractor.toFields(),
          v.payment_arbiter.toFields(),
          v.start_after.toFields(),
          v.finish_before.toFields()
        )
    );
  }
}

export class Preimage extends Struct({
  contract: CircuitString,
  address: PublicKey,
  employer: PublicKey,
  contractor: PublicKey,
  arbiter: PublicKey,
  deposited: Outcome,
  success: Outcome,
  failure: Outcome,
  cancel: Outcome,
}) {
  static hash(v: Preimage): Field {
    return Poseidon.hash(
      v.contract
        .toFields()
        .concat(
          v.address.toFields(),
          v.employer.toFields(),
          v.contractor.toFields(),
          v.arbiter.toFields(),
          v.deposited.description.toFields(),
          v.deposited.payment_employer.toFields(),
          v.deposited.payment_contractor.toFields(),
          v.deposited.payment_arbiter.toFields(),
          v.deposited.start_after.toFields(),
          v.deposited.finish_before.toFields(),
          v.success.description.toFields(),
          v.success.payment_employer.toFields(),
          v.success.payment_contractor.toFields(),
          v.success.payment_arbiter.toFields(),
          v.success.start_after.toFields(),
          v.success.finish_before.toFields(),
          v.failure.description.toFields(),
          v.failure.payment_employer.toFields(),
          v.failure.payment_contractor.toFields(),
          v.failure.payment_arbiter.toFields(),
          v.failure.start_after.toFields(),
          v.failure.finish_before.toFields(),
          v.cancel.payment_employer.toFields(),
          v.cancel.payment_contractor.toFields(),
          v.cancel.payment_arbiter.toFields(),
          v.cancel.start_after.toFields(),
          v.cancel.finish_before.toFields()
        )
    );
  }
}
