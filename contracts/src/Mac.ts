import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  PrivateKey,
} from 'snarkyjs';

import { Preimage } from './preimage';

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
      deposit: Permissions.proofOrSignature(),
      withdraw: Permissions.proofOrSignature(),
      approveSuccess: Permissions.proofOrSignature(),
      approveFailure: Permissions.proofOrSignature(),
      cancel: Permissions.proofOrSignature(),
    });
  }

  @method init(commitment: Field) {
    this.commitment.set(commitment);
    this.automaton_state.set(Field(0));
    this.memory.set(Field(0));
  }

  @method deposit(contract_preimage: Preimage, signerPrivateKey: PrivateKey) {
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // make sure contract is in the or initial stage
    contract_preimage.isInitial(this.automaton_state);

    // make sure the caller is a party in the contract
    let actor: PublicKey = signerPrivateKey.toPublicKey();
    contract_preimage.isParty(actor).assertEqual();

    // make sure the party who attempts to deposit has not deposited yet
    // so there are three cases to consider, one for each party
    implies(
      contract_preimage.isEmployer(actor),
      this.memory
        .equals(0)
        .or(this.memory.equals(1))
        .or(this.memory.equals(2))
        .or(this.memory.equals(3))
    ).assertTrue();
    implies(
      contract_preimage.isContractor(actor),
      this.memory
        .equals(0)
        .or(this.memory.equals(1))
        .or(this.memory.equals(4))
        .or(this.memory.equals(5))
    ).assertTrue();
    implies(
      contract_preimage.isArbiter(actor),
      this.memory
        .equals(1)
        .or(this.memory.equals(3))
        .or(this.memory.equals(5))
        .or(this.memory.equals(7))
    ).assertTrue();

    // TODO allow the deposit to happen
    let next_memory_state: Field = Circuit.if(
      contract_preimage.isEmployer(actor),
      Circuit.if(
        this.memory.equals(0),
        Field(4),
        Circuit.if(
          this.memory.equals(1),
          Field(5),
          Circuit.if(this.memory.equals(2), Field(6))
        )
      )
    );
    // TODO if everyone deposited, update the state
  }

  @method withdraw() {
    // make sure this is the right contract
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // withdrawal is only possible if state is cancelled, succeeded or failed
    this.automaton_state
      .equals(Field(2)) // cancelled
      .or(this.automaton_state.equals(Field(3))) // succeeded
      .or(this.automaton_state.equals(Field(4))); // field

    // TODO
  }

  @method approveSuccess() {
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // approval can only be done
    // TODO
  }

  @method approveFailure() {
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // TODO
  }

  @method cancel() {
    // make sure this is the right contract by checking if
    // the caller is in possession of the correct preimage
    this.commitment.assertEquals(contract_preimage.getCommitment());

    // TODO
  }
}
