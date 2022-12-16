import AppContext from './AppContext';
import { finalizeContract } from './interaction';

import {
    PublicKey,
    PrivateKey
} from 'snarkyjs';

export async function contractDeploy(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createDeployTransactionAuro(
            context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient!.createDeployTransaction(
            context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransaction();
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

export async function contractInit(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createInitTransactionAuro(
            context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient!.createInitTransaction(
            context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransactionSign(context.state.actorPrivateKey);
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


export async function contractDeposit(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createDepositTransactionAuro(
            context.state.actorPrivateKey.toPublicKey());
    } else {
        await context.state.zkappWorkerClient!.createDepositTransaction(
            context.state.actorPrivateKey.toPublicKey(),
            context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransactionSign(context.state.actorPrivateKey);
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

export async function contractWithdraw(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createWithdrawTransactionAuro(
            context.state.actorPrivateKey.toPublicKey(),
            context.state.actorPrivateKey);
    } else {
        await context.state.zkappWorkerClient!.createWithdrawTransaction(
            context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransactionSign(context.state.actorPrivateKey);
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

export async function contractCancel(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createCancelTransactionAuro(
            context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient!.createCancelTransaction(
            context.state.actorPrivateKey.toPublicKey(),
            context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransactionSign(context.state.actorPrivateKey);
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

export async function contractSuccess(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createSuccessTransactionAuro(
            context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient!.createSuccessTransaction(
            context.state.actorPrivateKey.toPublicKey(),
            context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    let _hash = '';
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransactionSign(context.state.actorPrivateKey);
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

export async function contractFailure(context) {
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
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    if (context.usingAuro) {
        await context.state.zkappWorkerClient!.createFailureTransactionAuro(
            context.state.actorPrivateKey.toPublicKey(),
            context.state.actorPrivateKey);
    } else {
        await context.state.zkappWorkerClient!.createFailureTransaction(
            context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    console.log('proveTransaction');
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    console.log('getTransactionJSON');
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
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
        const { hash } = await context.state.zkappWorkerClient!.sendTransactionSign(context.state.actorPrivateKey);
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
