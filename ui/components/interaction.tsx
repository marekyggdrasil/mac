import Link from 'next/link';
import { useContext } from 'react';

import AppContext from './AppContext';
import { MinaValue } from './highlights';
import { RenderContractDescription } from './ContractRendering';

async function finalizeContract(context) {
    // instantiate preimage via worker and compute macpack
    context.state.zkappWorkerClient.definePreimage(
        context.state.zkappPublicKey.toBase58(),
        context.state.contract_employer.toBase58(),
        context.state.contract_contractor.toBase58(),
        context.state.contract_arbiter.toBase58(),
        context.state.contract_description,
        context.state.contract_outcome_deposit_description,
        Math.abs(context.state.contract_outcome_deposit_after),
        Math.abs(context.state.contract_outcome_deposit_before),
        -Math.abs(context.state.contract_outcome_deposit_employer),
        -Math.abs(context.state.contract_outcome_deposit_contractor),
        -Math.abs(context.state.contract_outcome_deposit_arbiter),
        context.state.contract_outcome_success_description,
        Math.abs(context.state.contract_outcome_success_after),
        Math.abs(context.state.contract_outcome_success_before),
        Math.abs(context.state.contract_outcome_success_employer),
        Math.abs(context.state.contract_outcome_success_contractor),
        Math.abs(context.state.contract_outcome_success_arbiter),
        context.state.contract_outcome_failure_description,
        Math.abs(context.state.contract_outcome_failure_after),
        Math.abs(context.state.contract_outcome_failure_before),
        Math.abs(context.state.contract_outcome_failure_employer),
        Math.abs(context.state.contract_outcome_failure_contractor),
        Math.abs(context.state.contract_outcome_failure_arbiter),
        context.state.contract_outcome_cancel_description,
        Math.abs(context.state.contract_outcome_cancel_after),
        Math.abs(context.state.contract_outcome_cancel_before),
        Math.abs(context.state.contract_outcome_cancel_employer),
        Math.abs(context.state.contract_outcome_cancel_contractor),
        Math.abs(context.state.contract_outcome_cancel_arbiter));
    // now get its macpack
    const macpack = await context.state.zkappWorkerClient.toMacPack();
    context.setState({ ...context.state, loaded: true, macpack: macpack });
}

async function contractDeploy(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...'
    });
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: context.state.publicKey! });
    console.log('finalizeContract');
    await finalizeContract(context);
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    await context.state.zkappWorkerClient!.createDeployTransaction(
        context.state.zkappPrivateKey);
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
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    console.log('sendTransaction');
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    console.log('done');
    context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ''
    });
}

async function contractDeposit(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Preparing...'
    });
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: context.state.publicKey! });
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    await context.state.zkappWorkerClient!.createDepositTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Proving...'
    });
    await context.state.zkappWorkerClient!.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: 'Initiating...'
    });
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ''
    });
}

async function contractWithdraw(context) {
    const transactionFee = 0.1;
    context.setState({ ...context.state, creatingTransaction: true });
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: context.state.publicKey! });
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    await context.state.zkappWorkerClient!.createWithdrawTransaction();
    await context.state.zkappWorkerClient!.proveTransaction();
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    context.setState(
        { ...context.state, creatingTransaction: false, deployed: true });
}

async function contractCancel(context) {
    const transactionFee = 0.1;
    context.setState({ ...context.state, creatingTransaction: true });
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: context.state.publicKey! });
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    await context.state.zkappWorkerClient!.createCancelTransaction();
    await context.state.zkappWorkerClient!.proveTransaction();
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    context.setState(
        { ...context.state, creatingTransaction: false, deployed: true });
}

async function contractSuccess(context) {
    const transactionFee = 0.1;
    context.setState({ ...context.state, creatingTransaction: true });
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: context.state.publicKey! });
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    await context.state.zkappWorkerClient!.createSuccessTransaction();
    await context.state.zkappWorkerClient!.proveTransaction();
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    context.setState(
        { ...context.state, creatingTransaction: false, deployed: true });
}

async function contractFailure(context) {
    const transactionFee = 0.1;
    context.setState({ ...context.state, creatingTransaction: true });
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: context.state.publicKey! });
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    await context.state.zkappWorkerClient!.createFailureTransaction();
    await context.state.zkappWorkerClient!.proveTransaction();
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    context.setState(
        { ...context.state, creatingTransaction: false, deployed: true });
}

const DeployButton = () => {
    const context = useContext(AppContext);
    if (context.state.tx_building_state == '') {
        return (<button className="btn" onClick={async () => {
            await contractDeploy(context);
        }}>Deploy</button>);
    }
    return (<button className="btn btn-disabled animate-pulse">{ context.state.tx_building_state }</button>)
}

const InteractionUI = () => {
    return (<div>
        <p>Your contract state is</p>
        <p>Interacting as <MinaValue>{ context.state.publicKey.toBase58() }</MinaValue>. Your role in this contract is</p>
        <button className="btn" onClick={async () => {
            await contractDeploy(context);
        }}>Deploy</button>
        <button className="btn" onClick={async () => {
            await contractDeposit(context);
        }}>Deposit</button>
        <button className="btn" onClick={async () => {
            await contractWithdraw(context);
        }}>Withdraw</button>
        <button className="btn" onClick={async () => {
            await contractCancel(context);
        }}>Cancel</button>
        <button className="btn" onClick={async () => {
            await contractSuccess(context);
        }}>Success</button>
        <button className="btn" onClick={async () => {
            await contractFailure(context);
        }}>Failure</button>
    </div>)
}

const InteractionEditor = () => {
    const context = useContext(AppContext);
    if (!context.state.deployed) {
        if (context.state.comp_button_state < 4) {
            return (
                <div>Your contract is finalized and is is already possible to <Link href="/export">export</Link> it using MacPacks. However, it is not available on-chain. Make sure you compile the zk-SNARK circuit first and then you may deploy it. Compilation will take between 7 and 20 minutes so make sure you have some nice show to watch in the meantime.</div>);
        } else {
            return (
                <div>Your contract is finalized and is is already possible to <Link href="/export">export</Link> it using MacPacks. However, it is not available on-chain. You may <button className="btn" onClick={async () => {
                    await contractDeploy(context);
                }}>Deploy</button> it now.</div>);
        }

    }
    return (
        <div>
            <h2>Interaction</h2>
            <InteractionUI />
        </div>);
}


const InteractionCases = () => {
    const context = useContext(AppContext);
    if (context.state.comp_button_state < 2) {
        return (<div>Make sure you load the SnarkyJS library!</div>);
    } else if (context.state.connect_button_state < 2) {
        return (<div>Make sure you connect your AuroWallet!</div>);
    } else if (!context.state.loaded) {
        return (<div>Now you may <Link href="/create">create a new contract</Link> or <Link href="/import">import an existing contract</Link>.</div>);
    } else {
        return (
            <div>
                <InteractionEditor/>
                <RenderContractDescription />
            </div>);
    }
}

const Interaction = () => {
    return (
        <article className="container prose">
            <h1>Interact with a MAC contract</h1>
            <InteractionCases />
        </article>);
}

/*
else if (context.state.comp_button_state < 4) {
   return (
   <div>Make sure you compile the ZK Circuit first!</div>
   );
   }
 */

export default Interaction;
