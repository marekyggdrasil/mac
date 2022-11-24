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
  UInt64,
  AccountUpdate,
} from 'snarkyjs';

import { Participant, Outcome, Preimage } from './preimage';
import { makeDummyPreimage } from './dummy';
import { Mac } from './Mac';

function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  let deployerAccount: PrivateKey = Local.testAccounts[0].privateKey;
  let employer_sk: PrivateKey = Local.testAccounts[1].privateKey;
  let contractor_sk: PrivateKey = Local.testAccounts[2].privateKey;
  let arbiter_sk: PrivateKey = Local.testAccounts[3].privateKey;
  return [deployerAccount, employer_sk, contractor_sk, arbiter_sk];
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

  beforeEach(async () => {
    await isReady;
    await Mac.compile();

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();

    [deployerAccount, employer_sk, contractor_sk, arbiter_sk] =
      createLocalBlockchain();

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
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('should correctly deploy Mac contract', async () => {
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
    Mina.getBalance(zkAppAddress).assertEquals(UInt64.from(0));
    Mina.getBalance(employer_pk).assertEquals(UInt64.from(1000000000000));
    Mina.getBalance(contractor_pk).assertEquals(UInt64.from(1000000000000));
    Mina.getBalance(arbiter_pk).assertEquals(UInt64.from(1000000000000));

    // let the employer do the deposit
    const tx_deposit_employer = await Mina.transaction(employer_sk, () => {
      zkAppInstance.deposit(mac_contract, employer_pk);
    });
    await tx_deposit_employer.prove();
    await tx_deposit_employer.sign([employer_sk]);
    await tx_deposit_employer.send();

    // check balances after the employer deposit
    Mina.getBalance(zkAppAddress).assertEquals(UInt64.from(12000000));
    Mina.getBalance(employer_pk).assertEquals(UInt64.from(999988000000));
    Mina.getBalance(contractor_pk).assertEquals(UInt64.from(1000000000000));
    Mina.getBalance(arbiter_pk).assertEquals(UInt64.from(1000000000000));

    // let the employer do the deposit
    const tx_deposit_contractor = await Mina.transaction(contractor_sk, () => {
      zkAppInstance.deposit(mac_contract, contractor_pk);
    });
    await tx_deposit_contractor.prove();
    await tx_deposit_contractor.sign([contractor_sk]);
    await tx_deposit_contractor.send();

    // check balances after the contractor deposit
    Mina.getBalance(zkAppAddress).assertEquals(UInt64.from(18000000));
    Mina.getBalance(employer_pk).assertEquals(UInt64.from(999988000000));
    Mina.getBalance(contractor_pk).assertEquals(UInt64.from(999994000000));
    Mina.getBalance(arbiter_pk).assertEquals(UInt64.from(1000000000000));

    // let the arbiter do the deposit
    const tx_deposit_arbiter = await Mina.transaction(arbiter_sk, () => {
      zkAppInstance.deposit(mac_contract, arbiter_pk);
    });
    await tx_deposit_arbiter.prove();
    await tx_deposit_arbiter.sign([arbiter_sk]);
    await tx_deposit_arbiter.send();

    // check balances after the arbiter deposit
    Mina.getBalance(zkAppAddress).assertEquals(UInt64.from(24000000));
    Mina.getBalance(employer_pk).assertEquals(UInt64.from(999988000000));
    Mina.getBalance(contractor_pk).assertEquals(UInt64.from(999994000000));
    Mina.getBalance(arbiter_pk).assertEquals(UInt64.from(999994000000));
  });
});
