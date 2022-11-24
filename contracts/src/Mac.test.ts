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
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    await isReady;
    await Mac.compile();

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();

    [deployerAccount, employer_sk, contractor_sk, arbiter_sk] =
      createLocalBlockchain();
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

    const tx = await Mina.transaction(employer_sk, () => {
      zkAppInstance.deposit(mac_contract, employer_sk.toPublicKey());
    });
    await tx.prove();
    await tx.sign([employer_sk]);
    await tx.send();
  });
});
