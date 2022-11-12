import {
  Field,
  PublicKey,
  CircuitValue,
  prop,
  arrayProp,
  Circuit,
  CircuitString,
  Poseidon,
} from 'snarkyjs';

export class Participant extends CircuitValue {
  @prop participant_address: PublicKey;

  constructor(participant_address: PublicKey) {
    super();
    this.participant_address = participant_address;
  }

  serialize(): Field[] {
    return this.toFields();
  }
}

export class Outcome extends CircuitValue {
  @prop description: CircuitString;

  @prop payment_employer: Field;
  @prop payment_contractor: Field;
  @prop payment_arbiter: Field;

  @prop start_after: Field;
  @prop finish_before: Field;

  constructor(
    description: CircuitString,
    payment_employer: Field,
    payment_contractor: Field,
    payment_arbiter: Field,
    start_after: Field,
    finish_before: Field
  ) {
    super();

    this.description = description;

    this.payment_employer = payment_employer;
    this.payment_contractor = payment_contractor;
    this.payment_arbiter = payment_arbiter;

    this.start_after = start_after;
    this.finish_before = finish_before;
  }

  serialize(): Field[] {
    return this.toFields();
  }
}

export class Preimage extends CircuitValue {
  @prop protocol_version: Field;

  @prop contract: CircuitString;

  @prop employer: Participant;
  @prop contractor: Participant;
  @prop arbiter: Participant;

  @prop deposited: Outcome;
  @prop success: Outcome;
  @prop failure: Outcome;
  @prop cancel: Outcome;

  constructor(
    contract: CircuitString,
    employer: Participant,
    contractor: Participant,
    arbiter: Participant,
    deposited: Outcome,
    success: Outcome,
    failure: Outcome,
    cancel: Outcome
  ) {
    super();

    this.protocol_version = Field(0);

    this.employer = employer;
    this.contractor = contractor;
    this.arbiter = arbiter;

    this.deposited = deposited;
    this.success = success;
    this.failure = failure;
    this.cancel = cancel;
  }

  // identify the actor of the contract
  isEmployer(actor: PublicKey) {
    return actor.equals(this.employer.participant_address);
  }

  isContractor(actor: PublicKey) {
    return actor.equals(this.contractor.participant_address);
  }

  isArbiter(actor: PublicKey) {
    return actor.equals(this.arbiter.participant_address);
  }

  isParty(actor: PublicKey) {
    return this.isEmployer(actor)
      .or(this.isContractor(actor))
      .or(this.isArbiter(actor));
  }

  // state identification
  isInitial(automaton_state: Field): Circuit {
    return automaton_state.equals(Field(0)); // initial state
  }

  isDeposit(automaton_state: Field): Circuit {
    return automaton_state.equals(Field(1)); // deposit state
  }

  isCanceled(automaton_state: Field): Circuit {
    return automaton_state.equals(Field(2)); // canceled state
  }

  isSuccess(automaton_state: Field): Circuit {
    return automaton_state.equals(Field(3)); // success state
  }

  isFailed(automaton_state: Field): Circuit {
    return automaton_state.equals(Field(4)); // failed state
  }

  // handling the serialization
  serialize(): Field[] {
    return this.toFields();
  }

  getCommitment(): Field {
    return Poseidon.hash(this.serialize());
  }

  // shareable contract
  getMacPack(): String {
    // TODO
    return 'BEGINMACPACK. . ENDMACPACK.';
  }
}
