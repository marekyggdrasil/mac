import {
  Field,
  Bool,
  Circuit,
  Provable,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PrivateKey,
  PublicKey,
  UInt32,
  UInt64,
  AccountUpdate,
} from 'o1js';

import { Participant, Preimage, Outcome } from './preimage';

const state_initial: number = 0;
const state_deposited: number = 1;
const state_canceled_early: number = 2;
const state_canceled: number = 3;
const state_succeeded: number = 4;
const state_failed: number = 5;

export class Mac extends SmartContract {
  // on-chain state is public
  @state(Field) commitment = State<Field>();

  // 0 - initial
  // 1 - everyone deposited
  // 2 - someone canceled for free because deposit was not yet done
  // 3 - contractor canceled for penalty
  // 4 - contract succeeded
  // 5 - contract failed
  @state(Field) automaton_state = State<Field>();

  // E - employer
  // C - contractor
  // A - arbiter
  //
  // ECA
  // 000 - 0
  // 001 - 1
  // 010 - 2
  // 011 - 3
  // 100 - 4
  // 101 - 5
  // 110 - 6
  // 111 - 7
  @state(Field) memory = State<Field>();
  // ...and method arguments are private, beautiful, right?

  init() {
    super.init();
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proof(),
      send: Permissions.proof(),
    });
  }

  @method async initialize(commitment: Field) {
    this.commitment.set(commitment);
    this.automaton_state.set(Field(0));
    this.memory.set(Field(0));
  }

  @method async deposit(contract_preimage: Preimage, actor: PublicKey) {
    const commitment: Field = this.commitment.getAndRequireEquals();
    const automaton_state: Field = this.automaton_state.getAndRequireEquals();
    const memory: Field = this.memory.getAndRequireEquals();
    const blockchain_length: UInt32 =
      this.network.blockchainLength.getAndRequireEquals();

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.equals(contract_preimage.getCommitment());

    // check if the deposit deadline is respected
    blockchain_length.assertGreaterThanOrEqual(
      contract_preimage.deposited.start_after
    );
    blockchain_length.assertLessThan(contract_preimage.deposited.finish_before);

    // make sure the caller is a party in the contract
    actor
      .equals(contract_preimage.arbiter.participant_address)
      .or(actor.equals(contract_preimage.contractor.participant_address))
      .or(actor.equals(contract_preimage.employer.participant_address))
      .assertTrue();

    // only someone who has not yet deposited can deposit
    const actions: Bool[] = memory.toBits(3);
    const acted: Bool = Provable.if(
      actor.equals(contract_preimage.employer.participant_address),
      actions[2],
      Provable.if(
        actor.equals(contract_preimage.contractor.participant_address),
        actions[1],
        actions[0]
      )
    );
    const has_not_acted: Bool = acted.not();
    has_not_acted.assertTrue();

    // do the deposit
    const amount: UInt64 = Provable.if(
      actor.equals(contract_preimage.employer.participant_address),
      contract_preimage.deposited.payment_employer,
      Provable.if(
        actor.equals(contract_preimage.contractor.participant_address),
        contract_preimage.deposited.payment_contractor,
        Provable.if(
          actor.equals(contract_preimage.arbiter.participant_address),
          contract_preimage.deposited.payment_arbiter,
          UInt64.from(0)
        )
      )
    );
    // worked until here TODO delete this

    // transfer the funds
    const payerUpdate = AccountUpdate.createSigned(actor);
    const recipientUpdate = AccountUpdate.create(this.address);
    payerUpdate.send({ to: recipientUpdate, amount: amount });

    // update the memory
    actions[2] = Provable.if(
      actor.equals(contract_preimage.employer.participant_address),
      Bool(true),
      actions[2]
    );
    actions[1] = Provable.if(
      actor.equals(contract_preimage.contractor.participant_address),
      Bool(true),
      actions[1]
    );
    actions[0] = Provable.if(
      actor.equals(contract_preimage.arbiter.participant_address),
      Bool(true),
      actions[0]
    );

    // check if everyone acted
    const has_everyone_acted: Bool = actions[0].and(actions[1]).and(actions[2]);

    // update the memory
    const new_memory: Field = Provable.if(
      has_everyone_acted,
      Field(0),
      Field.fromBits(actions)
    );
    this.memory.set(new_memory);

    // update state
    const new_state: Field = Provable.if(
      has_everyone_acted,
      Field(state_deposited),
      Field(state_initial)
    );
    this.automaton_state.set(new_state);
  }

  @method async withdraw(contract_preimage: Preimage, actor: PublicKey) {
    const commitment: Field = this.commitment.getAndRequireEquals();
    const automaton_state: Field = this.automaton_state.getAndRequireEquals();
    const memory: Field = this.memory.getAndRequireEquals();
    const blockchain_length: UInt32 =
      this.network.blockchainLength.getAndRequireEquals();

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.equals(contract_preimage.getCommitment());

    // make sure the caller is a party in the contract
    actor
      .equals(contract_preimage.arbiter.participant_address)
      .or(actor.equals(contract_preimage.contractor.participant_address))
      .or(actor.equals(contract_preimage.employer.participant_address))
      .assertTrue();

    // check who has acted
    const actions: Bool[] = memory.toBits(3);
    const acted: Bool = Provable.if(
      actor.equals(contract_preimage.employer.participant_address),
      actions[2],
      Provable.if(
        actor.equals(contract_preimage.contractor.participant_address),
        actions[1],
        Provable.if(
          actor.equals(contract_preimage.arbiter.participant_address),
          actions[0],
          Bool(false)
        )
      )
    );
    const has_not_acted: Bool = acted.not();

    // determine if it is allowed to withdraw at this stage
    const is_state_canceled_early: Bool = automaton_state.equals(
      Field(state_canceled_early)
    );
    const is_state_canceled: Bool = automaton_state.equals(
      Field(state_canceled)
    );
    const is_state_succeeded: Bool = automaton_state.equals(
      Field(state_succeeded)
    );
    const is_state_failed: Bool = automaton_state.equals(Field(state_failed));

    // special case, unresolved is deposited but within unresolved deadline
    const is_state_deposited: Bool = automaton_state.equals(
      Field(state_deposited)
    );
    const is_within_unresolved_deadline: Bool = blockchain_length
      .greaterThanOrEqual(contract_preimage.unresolved.start_after)
      .and(
        blockchain_length.lessThan(contract_preimage.unresolved.finish_before)
      );
    const is_state_unresolved: Bool = is_within_unresolved_deadline.and(
      is_within_unresolved_deadline
    );

    const withdraw_allowed: Bool = is_state_canceled_early
      .and(acted)
      .or(is_state_canceled.and(has_not_acted))
      .or(is_state_succeeded.and(has_not_acted))
      .or(is_state_failed.and(has_not_acted))
      .or(is_state_unresolved.and(has_not_acted));
    withdraw_allowed.assertTrue();

    // determine the amount of the withdrawal
    const current_outcome: Outcome = Provable.if(
      is_state_canceled_early,
      Outcome,
      contract_preimage.deposited,
      Provable.if(
        is_state_canceled,
        Outcome,
        contract_preimage.cancel,
        Provable.if(
          is_state_succeeded,
          Outcome,
          contract_preimage.success,
          Provable.if(
            is_state_deposited,
            Outcome,
            contract_preimage.unresolved,
            contract_preimage.failure // only option left...
          )
        )
      )
    );
    const amount: UInt64 = Provable.if(
      actor.equals(contract_preimage.employer.participant_address),
      current_outcome.payment_employer,
      Provable.if(
        actor.equals(contract_preimage.contractor.participant_address),
        current_outcome.payment_contractor,
        current_outcome.payment_arbiter // only option left...
      )
    );

    // do the withdrawal
    this.send({ to: actor, amount: amount });

    // update the memory
    actions[2] = Provable.if(
      actor.equals(contract_preimage.employer.participant_address),
      actions[2].not(),
      actions[2]
    );
    actions[1] = Provable.if(
      actor.equals(contract_preimage.contractor.participant_address),
      actions[1].not(),
      actions[1]
    );
    actions[0] = Provable.if(
      actor.equals(contract_preimage.arbiter.participant_address),
      actions[0].not(),
      actions[0]
    );

    const new_memory: Field = Field.fromBits(actions);
    this.memory.set(new_memory);
  }

  @method async success(contract_preimage: Preimage, actor_pk: PublicKey) {
    const commitment: Field = this.commitment.getAndRequireEquals();
    const automaton_state: Field = this.automaton_state.getAndRequireEquals();
    const memory: Field = this.memory.getAndRequireEquals();
    const blockchain_length: UInt32 =
      this.network.blockchainLength.getAndRequireEquals();

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.equals(contract_preimage.getCommitment());

    // check if the deposit deadline is respected
    blockchain_length.assertGreaterThanOrEqual(
      contract_preimage.success.start_after
    );
    blockchain_length.assertLessThan(contract_preimage.success.finish_before);

    // make sure the caller is a party in the contract
    actor_pk
      .equals(contract_preimage.arbiter.participant_address)
      .or(actor_pk.equals(contract_preimage.contractor.participant_address))
      .or(actor_pk.equals(contract_preimage.employer.participant_address))
      .assertTrue();

    // make sure that the caller is approving this method
    AccountUpdate.create(actor_pk).requireSignature();

    // state must be deposited
    automaton_state.equals(Field(state_deposited));

    // ensure caller is the arbiter
    actor_pk.equals(contract_preimage.arbiter.participant_address).assertTrue();

    // update the state to "succeeded"
    this.automaton_state.set(Field(state_succeeded));

    // zero the memory for the withdrawals
    this.memory.set(Field(0));
  }

  @method async failure(contract_preimage: Preimage, actor_pk: PublicKey) {
    const commitment: Field = this.commitment.getAndRequireEquals();
    const automaton_state: Field = this.automaton_state.getAndRequireEquals();
    const memory: Field = this.memory.getAndRequireEquals();
    const blockchain_length: UInt32 =
      this.network.blockchainLength.getAndRequireEquals();

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.equals(contract_preimage.getCommitment());

    // check if the deposit deadline is respected
    blockchain_length.assertGreaterThanOrEqual(
      contract_preimage.failure.start_after
    );
    blockchain_length.assertLessThan(contract_preimage.failure.finish_before);

    // make sure the caller is a party in the contract
    actor_pk
      .equals(contract_preimage.arbiter.participant_address)
      .or(actor_pk.equals(contract_preimage.contractor.participant_address))
      .or(actor_pk.equals(contract_preimage.employer.participant_address))
      .assertTrue();

    // make sure that the caller is approving this method
    AccountUpdate.create(actor_pk).requireSignature();

    // state must be deposited
    automaton_state.equals(Field(state_deposited));

    // ensure caller is the arbiter
    actor_pk.equals(contract_preimage.arbiter.participant_address).assertTrue();

    // update the state to "canceled"
    this.automaton_state.set(Field(state_failed));

    // zero the memory for the withdrawals
    this.memory.set(Field(0));
  }

  @method async cancel(contract_preimage: Preimage, actor_pk: PublicKey) {
    const commitment: Field = this.commitment.getAndRequireEquals();
    const automaton_state: Field = this.automaton_state.getAndRequireEquals();
    const memory: Field = this.memory.getAndRequireEquals();
    const blockchain_length: UInt32 =
      this.network.blockchainLength.getAndRequireEquals();

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.equals(contract_preimage.getCommitment());

    // make sure the caller is a party in the contract
    actor_pk
      .equals(contract_preimage.arbiter.participant_address)
      .or(actor_pk.equals(contract_preimage.contractor.participant_address))
      .or(actor_pk.equals(contract_preimage.employer.participant_address))
      .assertTrue();

    // make sure that the caller is approving this method
    AccountUpdate.create(actor_pk).requireSignature();

    // before deposit deadline anyone can cancel
    const is_in_deposit: Bool = contract_preimage.deposited.start_after
      .lessThanOrEqual(blockchain_length)
      .and(
        contract_preimage.deposited.finish_before.greaterThan(blockchain_length)
      )
      .and(automaton_state.equals(Field(state_initial)));

    // after deposit deadline only the employee can cancel
    const is_within_deadline: Bool = contract_preimage.success.start_after
      .lessThanOrEqual(blockchain_length) // TODO parentheses bug?
      .and(
        contract_preimage.success.finish_before.greaterThan(blockchain_length)
      )
      .and(automaton_state.equals(Field(state_deposited)));

    // as for the deadline, it has to be either initial (for everyone)
    // either deposited (for employee) in order to cancel
    is_in_deposit.or(is_within_deadline).assertTrue();

    // if it is after the initial stage, caller must be employee
    const is_caller_correct: Bool = Provable.if(
      is_within_deadline,
      actor_pk.equals(contract_preimage.employer.participant_address), // TODO bug?, should be contractor?
      Bool(true)
    );

    is_caller_correct.assertTrue();

    // update the state to "canceled" or "canceled early"
    const next_state: Field = Provable.if(
      is_within_deadline,
      Field(state_canceled),
      Field(state_canceled_early)
    );
    this.automaton_state.set(next_state);

    // if canceled late then zero out the memory
    const next_memory: Field = Provable.if(
      is_within_deadline,
      Field(0),
      memory
    );
    this.memory.set(next_memory);
  }
}
