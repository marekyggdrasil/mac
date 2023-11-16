import ZkappWorkerClient from '../pages/zkAppWorkerClient';

import {
  MacContextType,
  castContext,
  castZkAppWorkerClient
} from './AppContext';

import { finalizeContract } from './interaction';

import {
    PublicKey,
    PrivateKey
} from 'o1js';

export async function contractDeploy(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...',
        tx_command: 'deploy'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      if (context.state.zkappPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createDeployTransactionAuro(
        context.state.zkappPrivateKey);
    } else {
      if (context.state.zkappPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createDeployTransaction(
        context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      const { hash } = await zkappWorkerClient.sendTransaction();
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: '',
        tx_command: ''
    });
}

export async function contractInit(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...',
        tx_command: 'init'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      await zkappWorkerClient.createInitTransactionAuro();
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createInitTransaction(
        context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      const { hash } = await zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: '',
        tx_command: ''
    });
}


export async function contractDeposit(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...',
        tx_command: 'deposit'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createDepositTransactionAuro(
        context.state.actorPrivateKey.toPublicKey());
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createDepositTransaction(
        context.state.actorPrivateKey.toPublicKey(),
        context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      const { hash } = await zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: '',
        tx_command: ''
    });
}

export async function contractWithdraw(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      await zkappWorkerClient.createWithdrawTransactionAuro();
    } else {
      if (context.state.zkappPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createWithdrawTransaction(
        context.state.zkappPrivateKey.toPublicKey(), context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      const { hash } = await zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ''
    });
}

export async function contractCancel(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      await zkappWorkerClient.createCancelTransactionAuro();
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createCancelTransaction(
        context.state.actorPrivateKey.toPublicKey(),
        context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      const { hash } = await zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ''
    });
}

export async function contractSuccess(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      await zkappWorkerClient.createSuccessTransactionAuro();
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createSuccessTransaction(
        context.state.actorPrivateKey.toPublicKey(),
        context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    let _hash = '';
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      const { hash } = await zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ''
    });
}

export async function contractFailure(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...'
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.state.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
  await zkappWorkerClient.fetchAccount(
    { publicKey: PublicKey.fromBase58(connectedAddress) });
  console.log('initZkappInstance');
  await zkappWorkerClient.initZkappInstance(
    context.state.zkappPublicKey);
  console.log('createDeployTransaction');
    if (context.state.usingAuro) {
      await zkappWorkerClient.createFailureTransactionAuro();
    } else {
      if (context.state.zkappPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      await zkappWorkerClient.createFailureTransaction(
        context.state.zkappPrivateKey.toPublicKey(),
        context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
  await zkappWorkerClient.proveTransaction();
  context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.state.usingAuro) {
      const transactionJSON = await zkappWorkerClient.getTransactionJSON();
      console.log('sendTransaction');
        console.log(transactionJSON);
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: '',
            },
        });
        await context.setTxHash(hash);
    } else {
      if (context.state.actorPrivateKey === null) {
        throw Error('Private key is not defined');
      }
      const { hash } = await zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
      console.log('done');
        console.log(hash);
        await context.setTxHash(hash);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ''
    });
}
