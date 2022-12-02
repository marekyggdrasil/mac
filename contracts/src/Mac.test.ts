import {
  isReady,
  shutdown,
  Bool,
  Field,
  Mina,
  Circuit,
  CircuitString,
  PrivateKey,
  PublicKey,
  UInt32,
  UInt64,
  AccountUpdate,
} from 'snarkyjs';

import { Participant, Outcome, Preimage } from './preimage';
import { makeDummyPreimage } from './dummy';
import { Mac } from './Mac';

async function deposit(
  mac_contract: Preimage,
  zkAppInstance: Mac,
  actor_sk: PrivateKey
) {
  const actor_pk: PublicKey = actor_sk.toPublicKey();
  const tx = await Mina.transaction(actor_sk, () => {
    zkAppInstance.deposit(mac_contract, actor_pk);
  });
  await tx.prove();
  await tx.sign([actor_sk]);
  await tx.send();
}

async function withdraw(
  mac_contract: Preimage,
  zkAppInstance: Mac,
  actor_sk: PrivateKey
) {
  const actor_pk: PublicKey = actor_sk.toPublicKey();
  const tx = await Mina.transaction(actor_sk, () => {
    zkAppInstance.withdraw(mac_contract, actor_pk);
  });
  await tx.prove();
  await tx.sign([actor_sk]);
  await tx.send();
}

function assertBalance(keys: PublicKey[], balances: number[]) {
  for (let i = 0; i < keys.length; ++i) {
    Mina.getBalance(keys[i]).assertEquals(UInt64.from(balances[i]));
  }
}

async function localDeploy(
  zkAppInstance: Mac,
  zkAppPrivatekey: PrivateKey,
  deployerAccount: PrivateKey,
  mac_contract: Preimage,
  employer_sk: PrivateKey,
  contractor_sk: PrivateKey,
  arbiter_sk: PrivateKey
) {
  const tx_deploy = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivatekey });
  });
  await tx_deploy.prove();
  await tx_deploy.sign([zkAppPrivatekey]);
  await tx_deploy.send();

  const tx_init = await Mina.transaction(deployerAccount, () => {
    zkAppInstance.initialize(mac_contract.getCommitment());
  });
  await tx_init.prove();
  await tx_init.sign([zkAppPrivatekey]);
  await tx_init.send();
}

describe('Mac tests', () => {
  let employer: Participant,
    contractor: Participant,
    arbiter: Participant,
    outcome_deposited: Outcome,
    outcome_success: Outcome,
    outcome_failure: Outcome,
    outcome_cancel: Outcome,
    mac_contract: Preimage;

  let deployerAccount: PrivateKey,
    employer_sk: PrivateKey,
    contractor_sk: PrivateKey,
    arbiter_sk: PrivateKey,
    employer_pk: PublicKey,
    contractor_pk: PublicKey,
    arbiter_pk: PublicKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey;

  // let local: Mina;

  beforeEach(async () => {
    await isReady;
    await Mac.compile();

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('should correctly deploy Mac contract, approve and withdraw but only at correct stages', async () => {
    const balance_initial = 1000000000000;
    const amount_payment = 6000000;
    const amount_deposit = 6000000;
    const amount_arbitration_reward_employer_share = 1000000;
    const amount_arbitration_reward_contractor_share = 1000000;

    const local = Mina.LocalBlockchain();
    Mina.setActiveInstance(local);
    local.setBlockchainLength(UInt32.from(0));

    deployerAccount = local.testAccounts[0].privateKey;
    employer_sk = local.testAccounts[1].privateKey;
    contractor_sk = local.testAccounts[2].privateKey;
    arbiter_sk = local.testAccounts[3].privateKey;

    employer_pk = employer_sk.toPublicKey();
    contractor_pk = contractor_sk.toPublicKey();
    arbiter_pk = arbiter_sk.toPublicKey();

    [
      employer,
      contractor,
      arbiter,
      outcome_deposited,
      outcome_success,
      outcome_failure,
      outcome_cancel,
      mac_contract,
    ] = makeDummyPreimage(employer_sk, contractor_sk, arbiter_sk);

    // deploy the contract
    const zkAppInstance = new Mac(zkAppAddress);
    await localDeploy(
      zkAppInstance,
      zkAppPrivateKey,
      deployerAccount,
      mac_contract,
      employer_sk,
      contractor_sk,
      arbiter_sk
    );

    // initial balance of the contract is zero
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [0, balance_initial, balance_initial, balance_initial]
    );
    local.setBlockchainLength(UInt32.from(1));

    // let the employer do the deposit
    await deposit(mac_contract, zkAppInstance, employer_sk);

    // prevent employer from accidentally depositing again
    await expect(async () => {
      await deposit(mac_contract, zkAppInstance, employer_sk);
    }).rejects.toThrow();

    // check balances after the employer deposit
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_payment + amount_deposit,
        balance_initial - amount_payment - amount_deposit,
        balance_initial,
        balance_initial,
      ]
    );
    local.setBlockchainLength(UInt32.from(2));

    // let the employer do the deposit
    await deposit(mac_contract, zkAppInstance, contractor_sk);

    // check balances after the contractor deposit
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_payment + 2 * amount_deposit,
        balance_initial - amount_payment - amount_deposit,
        balance_initial - amount_deposit,
        balance_initial,
      ]
    );

    local.setBlockchainLength(UInt32.from(3));

    // let the arbiter do the deposit
    await deposit(mac_contract, zkAppInstance, arbiter_sk);
    local.setBlockchainLength(UInt32.from(4));

    // check balances after the arbiter deposit
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_payment + 3 * amount_deposit,
        balance_initial - amount_payment - amount_deposit,
        balance_initial - amount_deposit,
        balance_initial - amount_deposit,
      ]
    );

    // prevent arbiter from doing withdrawal at this stage
    await expect(async () => {
      await withdraw(mac_contract, zkAppInstance, arbiter_sk);
    }).rejects.toThrow();
    local.setBlockchainLength(UInt32.from(5));

    // now the arbitrator approves the job done by the employee
    const tx_approval = await Mina.transaction(arbiter_sk, () => {
      zkAppInstance.success(mac_contract, arbiter_sk);
    });
    await tx_approval.prove();
    await tx_approval.sign([arbiter_sk]);
    await tx_approval.send();
    local.setBlockchainLength(UInt32.from(5));

    // let the contractor do the withdrawal
    await withdraw(mac_contract, zkAppInstance, contractor_sk);

    local.setBlockchainLength(UInt32.from(6));

    // check if the contractor has been paid
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_payment +
          amount_deposit +
          amount_arbitration_reward_contractor_share,
        balance_initial - amount_payment - amount_deposit,
        balance_initial +
          amount_payment -
          amount_arbitration_reward_contractor_share,
        balance_initial - amount_deposit,
      ]
    );

    // let the arbiter get paid for own service as well
    await withdraw(mac_contract, zkAppInstance, arbiter_sk);

    // check if the arbiter has been paid
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_deposit - amount_arbitration_reward_employer_share,
        balance_initial - amount_payment - amount_deposit,
        balance_initial +
          amount_payment -
          amount_arbitration_reward_contractor_share,
        balance_initial +
          amount_arbitration_reward_employer_share +
          amount_arbitration_reward_contractor_share,
      ]
    );

    // finally, let the employer get own deposit back - the fee for the arbiter
    await withdraw(mac_contract, zkAppInstance, employer_sk);

    // check if the employer has been paid
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        0,
        balance_initial -
          amount_payment -
          amount_arbitration_reward_employer_share,
        balance_initial +
          amount_payment -
          amount_arbitration_reward_contractor_share,
        balance_initial +
          amount_arbitration_reward_employer_share +
          amount_arbitration_reward_contractor_share,
      ]
    );
  });
});
