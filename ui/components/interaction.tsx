import Link from 'next/link';
import { useContext } from 'react';

import AppContext from './AppContext';
import { MinaValue } from './highlights';
import { RenderContractDescription } from './ContractRendering';
import {
    PublicKey
} from 'snarkyjs';

export async function finalizeContract(context) {
    // instantiate preimage via worker and compute macpack
    await context.state.zkappWorkerClient.definePreimage(
        context.state.zkappPublicKey.toBase58(),
        context.state.contract_employer.toBase58(),
        context.state.contract_contractor.toBase58(),
        context.state.contract_arbiter.toBase58(),
        context.state.contract_description,
        context.state.contract_outcome_deposit_description,
        Math.abs(context.state.contract_outcome_deposit_after),
        Math.abs(context.state.contract_outcome_deposit_before),
        Math.abs(context.state.contract_outcome_deposit_employer),
        Math.abs(context.state.contract_outcome_deposit_contractor),
        Math.abs(context.state.contract_outcome_deposit_arbiter),
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
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    console.log('fetchAccount');
    await context.state.zkappWorkerClient!.fetchAccount(
        { publicKey: PublicKey.fromBase58(context.connectedAddress) });
    console.log('initZkappInstance');
    await context.state.zkappWorkerClient.initZkappInstance(
        context.state.zkappPublicKey);
    console.log('createDeployTransaction');
    await context.state.zkappWorkerClient!.createDeployTransaction(
        context.state.zkappPrivateKey, context.state.deployerPrivateKey);
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
    /*
    const transactionJSON = await context.state.zkappWorkerClient!.getTransactionJSON();
    console.log('sendTransaction');
    console.log(transactionJSON);
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            memo: '',
        },
    });
    */
    const { hash } = await context.state.zkappWorkerClient!.sendDeployTransaction();
    console.log('done');
    console.log(hash);
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
        { publicKey: context.connectedAddress! });
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
        { publicKey: context.connectedAddress! });
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
        { publicKey: context.connectedAddress! });
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
        { publicKey: context.connectedAddress! });
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
        { publicKey: context.connectedAddress! });
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

async function contractRefreshState(context) {
    const contract_state = await context.state.zkappWorkerClient!.getContractState();
    context.setState(
        { ...context.state,
          employerActed: contract_state['acted']['employer'],
          contractorActed: contract_state['acted']['contractor'],
          arbiterActed: contract_state['acted']['arbiter'],
          automatonState: contract_state['automatonState'] });

}

const DeployButton = () => {
    const context = useContext(AppContext);
    if (context.state.deployed) {
        return (<button className="btn btn-primary btn-disabled">Deploy</button>);
    } else if (context.state.tx_building_state == '') {
        return (<button className="btn btn-primary" onClick={async () => {
            await contractDeploy(context);
        }}>Deploy</button>);
    }
    return (<button className="btn btn-primary btn-disabled animate-pulse">{ context.state.tx_building_state }</button>);
}


const DepositButton = () => {
    const context = useContext(AppContext);
    if (
        (context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
        return (<button className="btn" onClick={async () => {
            await contractDeposit(context);
        }}>Deposit</button>);
    }
    return (<button className="btn btn-primary btn-disabled">Deposit</button>);
}


const WithdrawButton = () => {
    const context = useContext(AppContext);
    if ((context.connectedAddress === null) || (context.blockchainLength < context.state.contract_outcome_deposit_after)) {
        return (<button className="btn btn-primary btn-disabled">Withdraw</button>);
    }
    return (<button className="btn btn-primary" onClick={async () => {
        await contractWithdraw(context);
    }}>Withdraw</button>);
}


const SuccessButton = () => {
    const context = useContext(AppContext);
    if (context.connectedAddress === null) {
        return (<button className="btn btn-primary btn-disabled">Judge success</button>);
    }
    const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
    if (
        (context.state.contract_outcome_success_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_success_before) &&
        (actor == context.state.contract_arbiter)) {
        return (<button className="btn" onClick={async () => {
            await contractSuccess(context);
        }}>Judge success</button>);
    }
    return (<button className="btn btn-primary btn-disabled">Judge success</button>);
}


const FailureButton = () => {
    const context = useContext(AppContext);
    if (context.connectedAddress === null) {
        return (<button className="btn btn-primary btn-disabled">Judge failure</button>);
    }
    const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
    if (
        (context.state.contract_outcome_failure_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_failure_before) &&
        (actor == context.contract_arbiter)) {
        return (<button className="btn" onClick={async () => {
            await contractFailure(context);
        }}>Judge failure</button>);
    }
    return (<button className="btn btn-primary btn-disabled">Judge failure</button>);
}


const CancelButton = () => {
    const context = useContext(AppContext);
    if (context.connectedAddress === null) {
        return (<button className="btn btn-primary btn-disabled">Cancel for free</button>);
    }
    const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
    if (
        (context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
        return (<button className="btn" onClick={async () => {
            await contractCancel(context);
        }}>Cancel for free</button>);
    } else if (
        (context.state.contract_outcome_cancel_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_cancel_before) &&
        (actor == context.state.contract_contractor)) {
        return (<button className="btn" onClick={async () => {
            await contractCancel(context);
        }}>Cancel for penalty</button>);
    }
    return (<button className="btn btn-primary btn-disabled">Cancel for penalty</button>);
}


const RefreshStateButton = () => {
    const context = useContext(AppContext);
    if (!context.state.deployer) {
        return (<button className="btn btn-secondary btn-disabled">Refresh state</button>);
    }
    return (<button className="btn btn-secondary btn-disabled" onClick={async () => {
        await contractRefreshState(context);
    }}>Refresh state</button>);
}


const DeploymentInformation = () => {
    const context = useContext(AppContext);
    if (context.deployed) {
        return (<p>The contract has been deployed.</p>);
    } else if ((context.state.deploymentTxId == '') && (!context.deployed)) {
        return (<p>The contract is pending deployment.<DeployButton /></p>);
    } else {
        const url = "https://berkeley.minaexplorer.com/transaction/" + context.deploymentTxId;
        return (<p>Your contract deployment was submitted. Check the <a href={url} target="_blank" rel="noreferrer">{context.deploymentTxId}</a> hash.</p>);
    }
}

const ConnectedAccount = () => {
    const context = useContext(AppContext);
    if (context.connectedAddress !== null) {
        const employer = context.state.contract_employer.toBase58();
        const contractor = context.state.contract_contractor.toBase58();
        const arbiter = context.state.contract_arbiter.toBase58();
        switch (context.connectedAddress) {
            case employer:
                return (<p>Interacting as <MinaValue>{ context.connectedAddress }</MinaValue>. You take <strong>employer</strong> role in this contract.</p>);
                break;
            case contractor:
                return (<p>Interacting as <MinaValue>{ context.connectedAddress }</MinaValue>. You take <strong>contractor</strong> role in this contract.</p>);
                break;
            case arbiter:
                return (<p>Interacting as <MinaValue>{ context.connectedAddress }</MinaValue>. You take <strong>arbiter</strong> role in this contract.</p>);
                break;
            default:
                return (<p>Interacting as <MinaValue>{ context.connectedAddress }</MinaValue>. You take no role in this contract.</p>);
                break;
        }
    }
    return (<p>Failed to fetch your account from Auro wallet...</p>);
}

const CancelTimeLine = () => {
    const context = useContext(AppContext);
    if ((context.state.contract_outcome_cancel_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_cancel_before)) {
        return (<p>It is possible to <strong>cancel</strong> at the current stage with a financial penalty.</p>);
    } else if (context.blockchainLength < context.state.contract_outcome_cancel_before) {
        return (<p>The option to <strong>cancel</strong> with a financial penalty has not opened yet.</p>);
    }
    return (<p>The option to <strong>cancel</strong> with a financial penalty has already closed.</p>);
}

const ContractTimeline = () => {
    const context = useContext(AppContext);
    if (context.blockchainLength !== null) {
        if (context.blockchainLength < context.state.contract_outcome_deposit_after) {
            return (<p>The contract is in the <strong>warm-up</strong> stage</p>);
        } else if (
            (context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
            return (<p>The contract is in the <strong>deposit</strong> stage. It is possible to <strong>cancel</strong> for free with no consequences.</p>);
        } else if (
            (context.state.contract_outcome_success_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_success_before)) {
            return (<div><p>The contract is in the <strong>success declaration</strong> stage.</p><CancelTimeLine /></div>);
        } else if (
            (context.state.contract_outcome_failure_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_failure_before)) {
            return (<div><p>The contract is in the <strong>failure declaration</strong> stage.</p><CancelTimeLine /></div>);
        } else if (
            (context.state.contract_outcome_failure_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_failure_before)) {
            return (<div><p>The contract is in the <strong>failure declaration</strong> stage.</p><CancelTimeLine /></div>);
        } else {
            return (<div><p>All the contract stages have expired.</p><CancelTimeLine /></div>);
        }
    }
    return (<p>Failed to fetch current blockchain length... It is not possible to establish in which stage current contract is.</p>);
}

const EmployerActed = () => {
    const context = useContext(AppContext);
    if (context.state.employerActed) {
        return (<div>Employer has acted.</div>);
    }
    return (<div></div>);
}

const ContractorActed = () => {
    const context = useContext(AppContext);
    if (context.state.contractorActed) {
        return (<div>Contractor has acted.</div>);
    }
    return (<div></div>);
}

const ArbiterActed = () => {
    const context = useContext(AppContext);
    if (context.state.arbiterActed) {
        return (<div>Arbiter has acted.</div>);
    }
    return (<div></div>);
}

const WhoActed = () => {
    return (<p>
        <EmployerActed/>
        <ContractorActed/>
        <ArbiterActed/>
    </p>)
}

const InteractionUI = () => {
    const context = useContext(AppContext);
    return (<div>
        <ConnectedAccount />
        <ContractTimeline />
        <WhoActed/>
        <DeployButton/>
        <DepositButton/>
        <WithdrawButton/>
        <SuccessButton/>
        <FailureButton/>
        <CancelButton/>
        <RefreshStateButton/>
    </div>)
}

const InteractionEditor = () => {
    const context = useContext(AppContext);
    if (!context.state.deployed) {
        if (context.compilationButtonState < 4) {
            return (
                <div>Your contract is finalized and is is already possible to <Link href="/export">export</Link> it using MacPacks. However, it is not available on-chain. Make sure you compile the zk-SNARK circuit first and then you may deploy it. Compilation will take between 7 and 20 minutes so make sure you have some nice show to watch in the meantime.</div>);
        } else {
            return (
                <div>
                    <h2>Interaction</h2>
                    <DeploymentInformation />
                </div>);
        }

    }
    return (
        <div>
            <h2>Interaction</h2>
            <DeploymentInformation />
            <InteractionUI />
        </div>);
}


const InteractionCases = () => {
    const context = useContext(AppContext);
    if (context.compilationButtonState < 2) {
        return (<div>Make sure you load the SnarkyJS library!</div>);
    } else if (context.connectionButtonState < 2) {
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
