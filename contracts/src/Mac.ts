import {
  Field,
  Bool,
  Circuit,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PrivateKey,
  PublicKey,
  UInt64,
  AccountUpdate,
} from 'snarkyjs';

import { Preimage } from './preimage';

const state_initial: number = 0;
const state_deposited: number = 1;
const state_canceled: number = 2;
const state_succeeded: number = 3;
const state_failed: number = 4;

export class Mac extends SmartContract {
  // on-chain state is public
  @state(Field) commitment = State<Field>();

  // 0 - initial
  // 1 - everyone deposited
  // 2 - someone decided to cancel
  // 3 - contract succeeded
  // 4 - contract failed
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

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proof(),
      send: Permissions.proof(),
    });
  }

  @method initialize(commitment: Field) {
    this.commitment.set(commitment);
    this.automaton_state.set(Field(0));
    this.memory.set(Field(0));
  }

  @method deposit(contract_preimage: Preimage, actor: PublicKey) {
    const commitment: Field = this.commitment.get();
    this.commitment.assertEquals(commitment);

    const automaton_state: Field = this.automaton_state.get();
    this.automaton_state.assertEquals(automaton_state);

    const memory: Field = this.memory.get();
    this.memory.assertEquals(memory);

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.assertEquals(contract_preimage.getCommitment());

    // make sure the caller is a party in the contract
    contract_preimage.isParty(actor).assertTrue();

    // only someone who has not yet deposited can deposit
    const actions: Bool[] = memory.toBits(3);
    const acted: Bool = Circuit.if(
      contract_preimage.isEmployer(actor),
      actions[0],
      Circuit.if(
        contract_preimage.isContractor(actor),
        actions[1],
        Circuit.if(contract_preimage.isArbiter(actor), actions[2], Bool(false))
      )
    );
    const has_not_acted: Bool = acted.not();
    has_not_acted.assertTrue();

    // do the deposit
    /*const amount: UInt64 = Circuit.if(
      actor.equals(contract_preimage.employer.participant_address),
      contract_preimage.deposited.payment_contractor,
      contract_preimage.deposited.payment_arbiter
    );*/
    //UInt64.from(1000000);
    const amount: UInt64 = Circuit.if(
      contract_preimage.isEmployer(actor),
      contract_preimage.deposited.payment_employer,
      Circuit.if(
        contract_preimage.isContractor(actor),
        contract_preimage.deposited.payment_contractor,
        Circuit.if(
          contract_preimage.isArbiter(actor),
          contract_preimage.deposited.payment_arbiter,
          UInt64.from(0)
        )
      )
    );

    // transfer the funds
    const payerUpdate = AccountUpdate.create(actor);
    payerUpdate.send({ to: this.address, amount: amount });

    // update the memory
    actions[0] = Circuit.if(
      contract_preimage.isEmployer(actor),
      Bool(true),
      actions[0]
    );
    actions[1] = Circuit.if(
      contract_preimage.isContractor(actor),
      Bool(true),
      actions[1]
    );
    actions[2] = Circuit.if(
      contract_preimage.isArbiter(actor),
      Bool(true),
      actions[2]
    );

    // check if everyone acted
    const has_everyone_acted: Bool = actions[0].and(actions[1]).and(actions[2]);

    // update the memory
    const new_memory: Field = Circuit.if(
      has_everyone_acted,
      Field(0),
      Field.fromBits(actions)
    );
    this.memory.set(new_memory);

    // update state
    const new_state: Field = Circuit.if(
      has_everyone_acted,
      Field(state_deposited),
      Field(state_initial)
    );
    this.automaton_state.set(new_state);
  }
}
