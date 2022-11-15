import {
  Bool,
  Field,
  SmartContract,
  Circuit,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  PrivateKey,
  AccountUpdate,
  UInt64,
} from 'snarkyjs';

import { Preimage } from './preimage';

const state_initial: number = 0;
const state_deposited: number = 1;
const state_canceled: number = 2;
const state_succeeded: number = 3;
const state_failed: number = 4;

function implies(a: Bool, b: Bool): Bool {
  return a.not().or(b);
}

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
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init(commitment: Field) {
    this.commitment.set(commitment);
    this.automaton_state.set(Field(0));
    this.memory.set(Field(0));
  }

  @method deposit(contract_preimage: Preimage, signerPrivateKey: PrivateKey) {
    const automaton_state: Field = this.automaton_state.get();
    const memory: Field = this.memory.get();

    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // make sure contract is in the or initial stage
    contract_preimage.isInitial(automaton_state);

    // make sure the caller is a party in the contract
    let actor: PublicKey = signerPrivateKey.toPublicKey();
    contract_preimage.isParty(actor).assertTrue();

    // only someone who has not yet deposited can deposit
    const has_not_acted: Bool = this.hasNotActed(contract_preimage, actor);
    has_not_acted.assertTrue();

    // do the deposit
    const amount: UInt64 = Circuit.if(
      contract_preimage.isEmployer(actor),
      contract_preimage.deposited.payment_employer,
      Circuit.if(
        contract_preimage.isContractor(actor),
        contract_preimage.deposited.payment_contractor,
        Circuit.if(
          contract_preimage.isArbiter(actor),
          contract_preimage.deposited.payment_arbiter,
          new UInt64(0)
        )
      )
    );
    const payerUpdate = AccountUpdate.createSigned(signerPrivateKey);
    payerUpdate.send({ to: this.address, amount });
    payerUpdate.sign(signerPrivateKey);

    // update the memory
    this.updateMemoryAfterAction(contract_preimage, actor);

    // update state
    const has_everyone_acted: Bool = this.hasEveryoneActed(contract_preimage);
    const new_state: Field = Circuit.if(
      has_everyone_acted,
      Field(state_deposited),
      Field(state_initial)
    );
    this.automaton_state.set(new_state);
  }

  @method withdraw(contract_preimage: Preimage) {
    const automaton_state: Field = this.automaton_state.get();
    const memory: Field = this.memory.get();
    // make sure this is the right contract
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // withdrawal is only possible if state is cancelled, succeeded or failed
    automaton_state
      .equals(Field(2)) // cancelled
      .or(automaton_state.equals(Field(3))) // succeeded
      .or(automaton_state.equals(Field(4)))
      .assertTrue(); // field

    // TODO
  }

  @method approveSuccess(contract_preimage: Preimage) {
    const commitment: Field = this.commitment.get();
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.assertEquals(contract_preimage.getCommitment());

    // approval can only be done
    // TODO
  }

  @method approveFailure(contract_preimage: Preimage) {
    const commitment: Field = this.commitment.get();
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    commitment.assertEquals(contract_preimage.getCommitment());

    // TODO
  }

  @method cancel(contract_preimage: Preimage) {
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // TODO
  }

  hasNotActed(contract_preimage: Preimage, actor: PublicKey): Bool {
    const automaton_state: Field = this.automaton_state.get();
    const memory: Field = this.memory.get();

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
    return acted.not();
  }

  hasEveryoneActed(contract_preimage: Preimage): Bool {
    const automaton_state: Field = this.automaton_state.get();
    const memory: Field = this.memory.get();

    const actions: Bool[] = memory.toBits(3);
    return actions[0].and(actions[1]).and(actions[2]);
  }

  updateMemoryAfterAction(contract_preimage: Preimage, actor: PublicKey) {
    const automaton_state: Field = this.automaton_state.get();
    const memory: Field = this.memory.get();

    let actions: Bool[] = memory.toBits(3);

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

    const new_memory: Field = Field.ofBits(actions);
    this.memory.set(new_memory);
  }
}
