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

  pk(): PublicKey {
    return this.participant_address;
  }

  serialize(): Field[] {
    return this.toFields();
  }

  static deserialize(serialized: Field[]): Participant {
    const deserialized: Participant = Participant.ofFields(serialized);
    if (deserialized === null) {
      throw Error();
    }
    return deserialized;
  }

  static deserializeBuffer(serialized: Field[]): [Participant, Field[]] {
    const len: number = 2;
    const tot: number = serialized.length;
    const deserialized: Participant = Participant.deserialize(
      serialized.slice(0, len)
    );
    return [deserialized, serialized.slice(len, tot)];
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

  static deserialize(serialized: Field[]): Outcome {
    const deserialized: Outcome = Outcome.ofFields(serialized);
    if (deserialized === null) {
      throw Error();
    }
    return deserialized;
  }

  static deserializeBuffer(serialized: Field[]): [Outcome, Field[]] {
    const len: number = 133;
    const tot: number = serialized.length;
    const deserialized: Outcome = Outcome.deserialize(serialized.slice(0, len));
    return [deserialized, serialized.slice(len, tot)];
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

    this.contract = contract;

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
  serialize(): [Field[], string] {
    let serialized: Field[] = [this.protocol_version];
    serialized = serialized.concat(this.employer.serialize());
    serialized = serialized.concat(this.contractor.serialize());
    serialized = serialized.concat(this.arbiter.serialize());
    serialized = serialized.concat(this.deposited.serialize());
    serialized = serialized.concat(this.success.serialize());
    serialized = serialized.concat(this.failure.serialize());
    serialized = serialized.concat(this.cancel.serialize());

    const contract_string: string = this.contract.toString();
    return [serialized, contract_string];
  }

  static deserialize(serialized: Field[], contract_string: string): Preimage {
    const protocol_version: Field = serialized[0];
    protocol_version.assertEquals(Field(0));

    let employer: Participant;
    let contractor: Participant;
    let arbiter: Participant;

    let outcome_deposited: Outcome;
    let outcome_success: Outcome;
    let outcome_failure: Outcome;
    let outcome_cancel: Outcome;

    let mac_contract: Preimage;
    let rem: Field[] = serialized.slice(1, serialized.length);

    [employer, rem] = Participant.deserializeBuffer(rem);
    if (employer === null) {
      throw Error();
    }

    [contractor, rem] = Participant.deserializeBuffer(rem);
    if (contractor === null) {
      throw Error();
    }

    [arbiter, rem] = Participant.deserializeBuffer(rem);
    if (arbiter === null) {
      throw Error();
    }

    [outcome_deposited, rem] = Outcome.deserializeBuffer(rem);
    if (outcome_deposited === null) {
      throw Error();
    }

    [outcome_success, rem] = Outcome.deserializeBuffer(rem);
    if (outcome_success === null) {
      throw Error();
    }

    [outcome_failure, rem] = Outcome.deserializeBuffer(rem);
    if (outcome_failure === null) {
      throw Error();
    }

    [outcome_cancel, rem] = Outcome.deserializeBuffer(rem);
    if (outcome_cancel === null) {
      throw Error();
    }

    mac_contract = new Preimage(
      CircuitString.fromString(contract_string),
      employer,
      contractor,
      arbiter,
      outcome_deposited,
      outcome_success,
      outcome_failure,
      outcome_cancel
    );
    return mac_contract;
  }

  getCommitment(): Field {
    const [serialized, contract_string]: [Field[], string] = this.serialize();
    const params_hash: Field = Poseidon.hash(serialized);
    const contract: CircuitString = CircuitString.fromString(contract_string);
    const contract_hash: Field = contract.hash();
    return Poseidon.hash([params_hash, contract_hash]);
  }

  // shareable contract
  getMacPack(): String {
    // TODO
    return 'BEGINMACPACK. . ENDMACPACK.';
  }
}
