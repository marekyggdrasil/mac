import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  PublicKey,
  fetchLastBlock,
  VerificationKey,
} from 'o1js';

import { Mac } from './Mac.js';
import { Preimage } from './strpreim.js';
import { fromMacPack } from './helpers.js';

import { deploy } from './deploy.js';
import fs from 'fs';
import readlineSync from 'readline-sync';

import {
  loopUntilAccountExists,
  makeAndSendTransaction,
  zkAppNeedsInitialization,
  accountExists,
} from './utils.js';

interface VerificationKeyData {
  data: string;
  hash: string;
}

(async function main() {
  await isReady;

  console.log('SnarkyJS loaded');

  /*
    for (let i=0; i<12; ++i) {
        let sk = PrivateKey.random();
        console.log(sk.toPublicKey().toBase58());
    }
    */
  // ----------------------------------------------------

  const Berkeley = Mina.BerkeleyQANet(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  Mina.setActiveInstance(Berkeley);

  let transactionFee = 100_000_000;

  const deployAlias = process.argv[2];

  const deployerKeysFileContents = fs.readFileSync(
    'keys/' + deployAlias + '.json',
    'utf8'
  );

  let zkAppPrivateKey: PrivateKey;
  let zkAppPublicKey: PublicKey;

  let deployerPrivateKey: PrivateKey;
  let deployerPublicKey: PublicKey;

  let employerPrivateKey: PrivateKey;
  let employerPublicKey: PublicKey;

  let contractorPrivateKey: PrivateKey;
  let contractorPublicKey: PublicKey;

  let arbiterPrivateKey: PrivateKey;
  let arbiterPublicKey: PublicKey;

  let vKey: VerificationKeyData;

  let zkapp: Mac;
  let contract_preimage: Preimage;
  let macpack = '';

  function castPublicKey(f: PublicKey | undefined): PublicKey {
    if (f === undefined) {
      throw Error();
    }
    return f;
  }

  function castPrivateKey(f: PrivateKey | undefined): PrivateKey {
    if (f === undefined) {
      throw Error();
    }
    return f;
  }

  function castPreimage(f: Preimage | undefined): Preimage {
    if (f === undefined) {
      throw Error();
    }
    return f;
  }

  function castMac(f: Mac | undefined): Mac {
    if (f === undefined) {
      throw Error();
    }
    return f;
  }

  async function fetchBlockchainLength() {
    let block = await fetchLastBlock(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    return parseInt(block.blockchainLength.toString());
  }

  async function runHelp(args: string[]) {
    console.log('Welcome to Mac!');
    console.log('Visit mac.sqrtxx.com');
    console.log('');
    console.log('Some example commands');
    console.log(
      'set sk zkapp EKEbHqkm8kexvCe5mUyBwyCTk36NmGAYKt8F5jbmicqnfCMjWTk9'
    );
    console.log(
      'set sk employer EKFYGqAwD5X31i5AerdmhRAFLuB91EszjgYUfPfcVgUTvSRF1XNE'
    );
    console.log(
      'set sk contractor EKENBAa1U2Q8ZpqqoSHL2X7BgNyPkrxWto6R9wCacbAdYCQv92pM'
    );
    console.log(
      'set sk arbiter EKEPXRusSd7RWbRvSitqTwsYYiXZ6gzjogVn5QYkpPi8P26j18K8'
    );
    console.log('run deposit employer');
    console.log('run deposit contractor');
    console.log('run deposit arbiter');
    console.log('run withdraw employer');
    console.log('run withdraw contractor');
    console.log('run withdraw arbiter');
    console.log('run success');
    console.log('run failure');
    console.log('run cancel');
    console.log('info');
    console.log('compile');
    console.log('instantiate');
    console.log('exit');
  }

  async function runCompile(args: string[]) {
    console.log('compiling, be patient...');
    let { verificationKey } = await Mac.compile();
    console.log('setting the verification key for the deployment...');
    vKey = verificationKey;
    console.log('done!');
  }

  async function runInstantiate(args: string[]) {
    zkapp = new Mac(zkAppPublicKey);
    contract_preimage = fromMacPack(macpack);
  }

  function getParty(name: string) {
    switch (name) {
      case 'employer':
        return castPublicKey(employerPublicKey);
      case 'contractor':
        return castPublicKey(contractorPublicKey);
      case 'arbiter':
        return castPublicKey(arbiterPublicKey);
    }
  }

  async function runDeploy() {
    await deploy(
      deployerPrivateKey,
      zkAppPrivateKey,
      zkAppPublicKey,
      zkapp,
      vKey
    );
  }

  async function runTx(args: string[]) {
    await makeAndSendTransaction({
      feePayerPrivateKey: castPrivateKey(deployerPrivateKey),
      zkAppPublicKey: castPublicKey(zkAppPublicKey),
      mutateZkApp: () => {
        switch (args[0]) {
          case 'initialize':
            zkapp.initialize(Preimage.hash(contract_preimage));
            break;
          case 'deposit':
            zkapp.deposit(contract_preimage, castPublicKey(getParty(args[1])));
            break;
          case 'withdraw':
            zkapp.withdraw(contract_preimage, castPublicKey(getParty(args[1])));
            break;
          case 'success':
            zkapp.success(contract_preimage, castPublicKey(getParty(args[1])));
            break;
          case 'failure':
            zkapp.failure(contract_preimage, castPublicKey(getParty(args[1])));
            break;
          case 'cancel':
            zkapp.cancel(contract_preimage, castPublicKey(getParty(args[1])));
            break;
        }
      },
      transactionFee: transactionFee,
      getState: () =>
        zkapp.automaton_state.get().toString() + zkapp.memory.get().toString(),
      statesEqual: (num1, num2) => num1 == num2,
    });
  }

  async function runSK(args: string[]) {
    switch (args[0]) {
      case 'zkapp':
        zkAppPrivateKey = PrivateKey.fromBase58(args[1]);
        zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        break;
      case 'deployer':
        deployerPrivateKey = PrivateKey.fromBase58(args[1]);
        deployerPublicKey = deployerPrivateKey.toPublicKey();
        break;
      case 'employer':
        employerPrivateKey = PrivateKey.fromBase58(args[1]);
        employerPublicKey = employerPrivateKey.toPublicKey();
        break;
      case 'contractor':
        contractorPrivateKey = PrivateKey.fromBase58(args[1]);
        contractorPublicKey = contractorPrivateKey.toPublicKey();
        break;
      case 'arbiter':
        arbiterPrivateKey = PrivateKey.fromBase58(args[1]);
        arbiterPublicKey = arbiterPrivateKey.toPublicKey();
        break;
    }
  }

  async function runPK(args: string[]) {
    switch (args[0]) {
      case 'zkapp':
        zkAppPublicKey = PublicKey.fromBase58(args[1]);
        break;
      case 'deployer':
        deployerPublicKey = PublicKey.fromBase58(args[1]);
        break;
      case 'employer':
        employerPublicKey = PublicKey.fromBase58(args[1]);
        break;
      case 'contractor':
        contractorPublicKey = PublicKey.fromBase58(args[1]);
        break;
      case 'arbiter':
        arbiterPublicKey = PublicKey.fromBase58(args[1]);
        break;
    }
  }

  async function runKey(args: string[]) {
    if (args[0] == 'sk') {
      return await runSK(args.slice(1, args.length));
    } else if (args[0] == 'pk') {
      return await runPK(args.slice(1, args.length));
    }
  }

  async function safePrintKey(
    name: string,
    key: PublicKey | PrivateKey | null
  ) {
    console.log(name);
    if (key !== null && key !== undefined) {
      console.log(key.toBase58());
      console.log();
      return;
    } else {
      console.log('null');
      console.log();
      return;
    }
  }

  async function runInfo(args: string[]) {
    await safePrintKey('zkApp', zkAppPublicKey);
    await safePrintKey('deployer', deployerPublicKey);
    await safePrintKey('employer', employerPublicKey);
    await safePrintKey('contractor', contractorPublicKey);
    await safePrintKey('arbiter', arbiterPublicKey);
    const blockchainLength: number = await fetchBlockchainLength();
    console.log('blockchain length');
    console.log(blockchainLength);
  }

  function runLoadMacPack(args: string[]) {
    macpack = fs.readFileSync(args[0]).toString();
  }

  let cmd = '';
  while (cmd != 'exit') {
    cmd = readlineSync.question('> ');
    console.log();
    const args: string[] = cmd.split(/\s+/);
    const command = args[0];
    switch (command) {
      case 'deploy':
        await runDeploy();
        break;
      case 'help':
        await runHelp(args.slice(1, args.length));
        break;
      case 'info':
        await runInfo(args.slice(1, args.length));
        break;
      case 'compile':
        await runCompile(args.slice(1, args.length));
        break;
      case 'instantiate':
        await runInstantiate(args.slice(1, args.length));
        break;
      case 'macpack':
        runLoadMacPack(args.slice(1, args.length));
        console.log(macpack);
        break;
      case 'set':
        await runKey(args.slice(1, args.length));
        break;
      case 'run':
        await runTx(args.slice(1, args.length));
        break;
    }
  }

  /*

  // ----------------------------------------------------

  let account = await loopUntilAccountExists({
    account: deployerPrivateKey.toPublicKey(),
    eachTimeNotExist: () => {
      console.log(
        'Deployer account does not exist. ' +
          'Request funds at faucet ' +
          'https://faucet.minaprotocol.com/?address=' +
          deployerPrivateKey.toPublicKey().toBase58()
      );
    },
    isZkAppAccount: false,
  });

  console.log(
    `Using fee payer account with nonce ${account.nonce}, balance ${account.balance}`
  );

  // ----------------------------------------------------

  console.log('Compiling smart contract...');
  let { verificationKey } = await Square.compile();

  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
  let zkapp = new Square(zkAppPublicKey);

  const accountExistsAlready = await accountExists(zkAppPublicKey);

  if (!accountExistsAlready) {
    // Programmatic deploy:
    //   Besides the CLI, you can also create accounts programmatically. This is useful if you need
    //   more custom account creation - say deploying a zkApp to a different key than the fee payer
    //   key, programmatically parameterizing a zkApp before initializing it, or creating Smart
    //   Contracts programmatically for users as part of an application.
    await deploy(deployerPrivateKey, zkAppPrivateKey, zkAppPublicKey, zkapp, verificationKey)
  }

  // ----------------------------------------------------

  let zkAppAccount = await loopUntilAccountExists({
    account: zkAppPrivateKey.toPublicKey(),
    eachTimeNotExist: () => console.log('waiting for zkApp account to be deployed...'),
    isZkAppAccount: true
  });

  const needsInitialization = await zkAppNeedsInitialization({ zkAppAccount });

  if (needsInitialization) {
    console.log('initializing smart contract');
    await makeAndSendTransaction({
      feePayerPrivateKey: deployerPrivateKey,
      zkAppPublicKey: zkAppPublicKey,
      mutateZkApp: () => zkapp.init(),
      transactionFee: transactionFee,
      getState: () => zkapp.num.get(),
      statesEqual: (num1, num2) => num1.equals(num2).toBoolean()
    });

    console.log('updated state!', zkapp.num.get().toString());
  }


  let num = (await zkapp.num.get())!;
  console.log('current value of num is', num.toString());

  // ----------------------------------------------------

  await makeAndSendTransaction({
    feePayerPrivateKey: deployerPrivateKey,
    zkAppPublicKey: zkAppPublicKey,
    mutateZkApp: () => zkapp.update(num.mul(num)),
    transactionFee: transactionFee,
    getState: () => zkapp.num.get(),
    statesEqual: (num1, num2) => num1.equals(num2).toBoolean()
  });

  console.log('updated state!', zkapp.num.get().toString());

  // ----------------------------------------------------

  */
  console.log('Shutting down');

  await shutdown();
})().catch((e) => console.log(e));
