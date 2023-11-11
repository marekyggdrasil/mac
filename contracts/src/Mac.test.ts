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
  Provable,
  UInt32,
  UInt64,
  AccountUpdate,
} from 'o1js';

//import { Participant, Outcome, Preimage } from './preimage';
//import { makeDummyPreimage } from './dummy';
import { Outcome, Preimage } from './strpreim';
import { makeDummyPreimage } from './strdummy';
import { Mac } from './Mac';

const state_initial: number = 0;
const state_deposited: number = 1;
const state_canceled_early: number = 2;
const state_canceled: number = 3;
const state_succeeded: number = 4;
const state_failed: number = 5;

/*
async function deposit(
  mac_contract: Preimage,
  zkAppInstance: Mac,
  actor_sk: PrivateKey
) {
  const actor_pk: PublicKey = actor_sk.toPublicKey();
  const tx = await Mina.transaction(actor_pk, () => {
    // zkAppInstance.deposit(mac_contract, actor_pk);
    zkAppInstance.simpledeposit(actor_pk);
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

async function success(
  mac_contract: Preimage,
  zkAppInstance: Mac,
  actor_sk: PrivateKey
) {
  const actor_pk: PublicKey = actor_sk.toPublicKey();
  const tx = await Mina.transaction(actor_sk, () => {
    zkAppInstance.success(mac_contract, actor_pk);
  });
  await tx.prove();
  await tx.sign([actor_sk]);
  await tx.send();
}

async function failure(
  mac_contract: Preimage,
  zkAppInstance: Mac,
  actor_sk: PrivateKey
) {
  const actor_pk: PublicKey = actor_sk.toPublicKey();
  const tx = await Mina.transaction(actor_sk, () => {
    zkAppInstance.failure(mac_contract, actor_pk);
  });
  await tx.prove();
  await tx.sign([actor_sk]);
  await tx.send();
}

async function cancel(
  mac_contract: Preimage,
  zkAppInstance: Mac,
  actor_sk: PrivateKey
) {
  const actor_pk: PublicKey = actor_sk.toPublicKey();
  const tx = await Mina.transaction(actor_sk, () => {
    zkAppInstance.cancel(mac_contract, actor_pk);
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
*/

/*
async function localDeploy(
  zkAppInstance: Mac,
  zkAppPrivateKey: PrivateKey,
  deployerAccount: PrivateKey,
  mac_contract: Preimage,
  employer_sk: PrivateKey,
  contractor_sk: PrivateKey,
  arbiter_sk: PrivateKey
) {
  const deployer_pk: PublicKey = deployerAccount.toPublicKey();
  const tx_deploy = await Mina.transaction(deployer_pk, () => {
    AccountUpdate.fundNewAccount(deployer_pk);
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
  });
  await tx_deploy.prove();
  await tx_deploy.sign([zkAppPrivateKey, deployerAccount]);
  await tx_deploy.send();

  const tx_init = await Mina.transaction(deployer_pk, () => {
    zkAppInstance.initialize(Preimage.hash(mac_contract));
  });
  await tx_init.prove();
  await tx_init.sign([deployerAccount]);
  await tx_init.send();
}
*/

describe('Mac tests', () => {
  let employer: PublicKey,
    contractor: PublicKey,
    arbiter: PublicKey,
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

  let zkAppInstance: Mac;

  let local: ReturnType<typeof Mina.LocalBlockchain>;

  beforeAll(async () => {
    await isReady;
    await Mac.compile();
  });

  beforeEach(async () => {
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();

    local = Mina.LocalBlockchain();
    Mina.setActiveInstance(local);
    local.setBlockchainLength(UInt32.from(0));

    deployerAccount = local.testAccounts[0].privateKey;
    employer_sk = local.testAccounts[1].privateKey;
    contractor_sk = local.testAccounts[2].privateKey;
    arbiter_sk = local.testAccounts[3].privateKey;

    employer_pk = employer_sk.toPublicKey();
    contractor_pk = contractor_sk.toPublicKey();
    arbiter_pk = arbiter_sk.toPublicKey();

    /*
    const tx_account = await Mina.transaction(employer_pk, () => {
      AccountUpdate.fundNewAccount(employer_pk);
    });
    await tx_account.sign([employer_sk]);
    await tx_account.send();
    */

    zkAppInstance = new Mac(zkAppAddress);

    /*
    [
      employer,
      contractor,
      arbiter,
      outcome_deposited,
      outcome_success,
      outcome_failure,
      outcome_cancel,
      mac_contract,
    ] = makeDummyPreimage(
      employer_sk, contractor_sk, arbiter_sk, zkAppAddress);

    // deploy the contract
    zkAppInstance = new Mac(zkAppAddress);
    await localDeploy(
      zkAppInstance,
      zkAppPrivateKey,
      deployerAccount,
      mac_contract,
      employer_sk,
      contractor_sk,
      arbiter_sk
    );
    */
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  /*
  it('should correctly deploy Mac contract, approve and withdraw but only at correct stages', async () => {
    const balance_initial = 1000000000000;
    const amount_payment = 6000000;
    const amount_deposit = 6000000;
    const amount_arbitration_reward_employer_share = 1000000;
    const amount_arbitration_reward_contractor_share = 1000000;

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
    await success(mac_contract, zkAppInstance, arbiter_sk);
    local.setBlockchainLength(UInt32.from(5));

    // at this stage, cancel and failure attempts must not succeed
    await expect(async () => {
      await cancel(mac_contract, zkAppInstance, arbiter_sk);
    }).rejects.toThrow();

    await expect(async () => {
      await failure(mac_contract, zkAppInstance, arbiter_sk);
    }).rejects.toThrow();

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
  */

  it.skip('simple test', async () => {
    // deploy
    const deployer_pk: PublicKey = deployerAccount.toPublicKey();
    const tx_deploy = await Mina.transaction(deployer_pk, () => {
      AccountUpdate.fundNewAccount(deployer_pk);
      zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    });
    await tx_deploy.prove();
    await tx_deploy.sign([zkAppPrivateKey, deployerAccount]);
    await tx_deploy.send();

    // run method
    const tx = await Mina.transaction(employer_pk, () => {
      // zkAppInstance.deposit(mac_contract, actor_pk);
      zkAppInstance.simpledeposit(employer_pk);
    });
    await tx.prove();
    await tx.sign([employer_sk]);
    await tx.send();
  });

  it('should allow the withdrawal with no consequences to those who deposited after early cancellation', async () => {
    /*
    const balance_initial = 1000000000000;
    const amount_payment = 6000000;
    const amount_deposit = 6000000;
    const amount_arbitration_reward_employer_share = 1000000;
    const amount_arbitration_reward_contractor_share = 1000000;

    console.log('1');
    // initial balance of the contract is zero
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [0, balance_initial, balance_initial, balance_initial]
    );
    local.setBlockchainLength(UInt32.from(1));

    console.log('2');
    // let the employer do the deposit
    console.log(Mina.getBalance(zkAppAddress).toString());
    console.log(Mina.getBalance(employer_pk).toString());


    const tx = await Mina.transaction(employer_pk, () => {
      // zkAppInstance.deposit(mac_contract, actor_pk);
      zkAppInstance.simpledeposit(employer_pk);
    });
    await tx.prove();
    await tx.sign([employer_sk]);
    await tx.send();
    */
    /*
    await deposit(mac_contract, zkAppInstance, employer_sk);
    console.log(Mina.getBalance(zkAppAddress).toString());
    console.log(Mina.getBalance(employer_pk).toString());
    */
    /*
    console.log('3');
    // check balances after the employer deposit

    assertBalance([zkAppAddress], [amount_payment + amount_deposit]);
    console.log('3.1');
    assertBalance(
      [employer_pk],
      [balance_initial - amount_payment - amount_deposit]
    );
    console.log('3.2');
    assertBalance([contractor_pk], [balance_initial]);
    console.log('3.3');
    assertBalance([arbiter_pk], [balance_initial]);
    console.log('3.4');
    /
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_payment + amount_deposit,
        balance_initial - amount_payment - amount_deposit,
        balance_initial,
        balance_initial,
      ]
    );
    /
    local.setBlockchainLength(UInt32.from(2));

    console.log('4');
    // let the contractor do the deposit
    await deposit(mac_contract, zkAppInstance, contractor_sk);

    console.log('5');
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

    console.log('6');
    // the arbiter did not do the deposit yet, contractor decides to cancel
    await cancel(mac_contract, zkAppInstance, contractor_sk);
    local.setBlockchainLength(UInt32.from(4));

    console.log('7');
    // now we test if everyone who deposited can withdraw what has been deposited
    // let the contractor do the withdrawal
    await withdraw(mac_contract, zkAppInstance, contractor_sk);

    console.log('8');
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [
        amount_payment + amount_deposit,
        balance_initial - amount_payment - amount_deposit,
        balance_initial,
        balance_initial,
      ]
    );

    console.log('9');
    // now the arbiter will try to withdraw, this must fail as the arbiter
    // did not do any deposit
    await expect(async () => {
      await withdraw(mac_contract, zkAppInstance, arbiter_sk);
    }).rejects.toThrow();

    console.log('10');
    // now the employer successfully withdraws own deposit
    await withdraw(mac_contract, zkAppInstance, employer_sk);

    console.log('11');
    // check if the balances returned to their original state
    assertBalance(
      [zkAppAddress, employer_pk, contractor_pk, arbiter_pk],
      [0, balance_initial, balance_initial, balance_initial]
    );
    console.log('12');
    */
  });
});
