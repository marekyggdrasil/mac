import Link from 'next/link';
import { useContext } from 'react';

import ZkappWorkerClient from '../pages/zkAppWorkerClient';

import {
  MacContextType,
  castContext,
  castZkAppWorkerClient
} from './AppContext';

import { MinaValue } from './highlights';
import {
    contractDeploy,
    contractInit,
    contractDeposit,
    contractWithdraw,
    contractCancel,
    contractSuccess,
    contractFailure
} from './txBuilding';
import { RenderContractDescription } from './ContractRendering';
import { InteractionModeUI } from './multiwallet';
import {
    PublicKey
} from 'snarkyjs';

interface ContractStateActedType {
  employer: boolean;
  contractor: boolean;
  arbiter: boolean;
}

interface ContractStateType {
  acted: ContractStateActedType;
  automaton_state: string;
}

export async function finalizeContract(context: MacContextType) {
  // instantiate preimage via worker and compute macpack
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  await zkappWorkerClient.definePreimage(
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
  const macpack = await zkappWorkerClient.toMacPack();
  context.setState({ ...context.state, loaded: true, macpack: macpack });
}

async function contractRefreshState(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const contract_state = await zkappWorkerClient.getContractState();
  const contract_state_parsed = JSON.parse(contract_state) as ContractStateType;
  context.setState(
    { ...context.state,
      employerActed: contract_state_parsed.acted.employer,
      contractorActed: contract_state_parsed.acted.contractor,
      arbiterActed: contract_state_parsed.acted.arbiter,
      automatonState: contract_state_parsed.automaton_state });

}

const DeployButton = () => {
  const context: MacContextType = castContext();
  if (!context.state.deployed) {
    if (
      (context.state.tx_building_state != '') &&
      (context.state.tx_command != 'deploy')) {
            return (<button className="btn btn-disabled animate-pulse">Deploy</button>);
        }
        if (
            (context.state.tx_building_state != '') &&
            (context.state.tx_command == 'deploy')) {
            return (<button className="btn btn-primary btn-disabled animate-pulse">{ context.state.tx_building_state }</button>);
        }
        return (<button className="btn btn-primary" onClick={async () => {
            await contractDeploy(context);
        }}>Deploy</button>);
    }
    return (<button className="btn btn-disabled">Deploy</button>);
}

const InitButton = () => {
  const context: MacContextType = castContext();
  if (!context.state.deployed) {
    return (<button className="btn btn-disabled">Initialize</button>);
    } else if (context.state.tx_building_state == '') {
        return (<button className="btn btn-primary" onClick={async () => {
            await contractInit(context);
        }}>Initialize</button>);
    } else if ((context.state.tx_building_state != '') && (context.state.tx_command != 'init')) {
        return (<button className="btn btn-primary btn-disabled">Initialize</button>);
    }
    return (<button className="btn btn-disabled animate-pulse">{ context.state.tx_building_state }</button>);
}

const DepositButton = () => {
  const context: MacContextType = castContext();
  if (
    (context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
    (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
    if (context.state.tx_building_state == '') {
            return (<button className="btn btn-primary" onClick={async () => {
                await contractDeposit(context);
            }}>Deposit</button>);
        } else if ((context.state.tx_building_state != '') && (context.state.tx_command != 'deposit')) {
            return (<button className="btn btn-disabled">Deposit</button>);
        }
    }
    return (<button className="btn btn-disabled">Deposit</button>);
}


const WithdrawButton = () => {
  const context: MacContextType = castContext();
  if ((context.connectedAddress === null) || (context.blockchainLength < context.state.contract_outcome_deposit_after)) {
    return (<button className="btn btn-disabled">Withdraw</button>);
    }
    return (<button className="btn btn-primary" onClick={async () => {
        await contractWithdraw(context);
    }}>Withdraw</button>);
}


const SuccessButton = () => {
  const context: MacContextType = castContext();
  if (context.connectedAddress === null) {
    return (<button className="btn btn-primary btn-disabled">Judge success</button>);
    }
    const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
    if (
        (context.state.contract_outcome_success_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_success_before) &&
        (actor == context.state.contract_arbiter)) {
        return (<button className="btn btn-primary" onClick={async () => {
            await contractSuccess(context);
        }}>Judge success</button>);
    }
    return (<button className="btn btn-disabled">Judge success</button>);
}


const FailureButton = () => {
  const context: MacContextType = castContext();
  if (context.connectedAddress === null) {
    return (<button className="btn btn-primary btn-disabled">Judge failure</button>);
    }
    const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
    if (
        (context.state.contract_outcome_failure_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_failure_before) &&
        (actor == context.state.contract_arbiter)) {
        return (<button className="btn btn-primary" onClick={async () => {
            await contractFailure(context);
        }}>Judge failure</button>);
    }
    return (<button className="btn btn-disabled">Judge failure</button>);
}


const CancelButton = () => {
  const context: MacContextType = castContext();
  if (context.connectedAddress === null) {
    return (<button className="btn btn-disabled">Cancel for free</button>);
    }
    const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
    if (
        (context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
        return (<button className="btn btn-primary" onClick={async () => {
            await contractCancel(context);
        }}>Cancel for free</button>);
    } else if (
        (context.state.contract_outcome_cancel_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_cancel_before) &&
        (actor == context.state.contract_contractor)) {
        return (<button className="btn btn-primary" onClick={async () => {
            await contractCancel(context);
        }}>Cancel for penalty</button>);
    }
    return (<button className="btn btn-disabled">Cancel for penalty</button>);
}

const GodMode = () => {
  const context: MacContextType = castContext();
  return (<div>
    <button className="btn btn-primary" onClick={async () => {
      await contractDeploy(context);
    }}>God Mode Deploy</button>
    <button className="btn btn-primary" onClick={async () => {
      await contractInit(context);
    }}>God Mode Initialize</button>
    <button className="btn btn-primary" onClick={async () => {
      await contractDeposit(context);
    }}>God Mode Deposit</button>
    <button className="btn btn-primary" onClick={async () => {
      await contractWithdraw(context);
    }}>God Mode Withdraw</button>
    <button className="btn btn-primary" onClick={async () => {
      await contractSuccess(context);
    }}>God Mode Judge success</button>
    <button className="btn btn-primary" onClick={async () => {
      await contractFailure(context);
    }}>God Mode Judge failure</button>
    <button className="btn btn-primary" onClick={async () => {
      await contractCancel(context);
    }}>God Mode Cancel for free</button>
  </div>);
}


const DeploymentInformation = () => {
  const context: MacContextType = castContext();
  if (context.state.deployed) {
    return (<p>The contract has been deployed.</p>);
    } else {
        return (<p>The contract is pending deployment.<DeployButton /></p>);
    }
}

const TxIds = () => {
  const context: MacContextType = castContext();
  if (context.txHash != '') {
    const url = "https://berkeley.minaexplorer.com/transaction/" + context.txHash;
        console.log(url);
        return (<div>Your last transaction is <a href={url} target="_blank" rel="noreferrer">{context.txHash}</a></div>);
    }
    return (<div></div>);
}

const ConnectedAccount = () => {
  const context: MacContextType = castContext();
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
  const context: MacContextType = castContext();
  if ((context.state.contract_outcome_cancel_after <= context.blockchainLength) &&
      (context.blockchainLength < context.state.contract_outcome_cancel_before)) {
    return (<p>It is possible to <strong>cancel</strong> at the current stage with a financial penalty.</p>);
    } else if (context.blockchainLength < context.state.contract_outcome_cancel_before) {
        return (<p>The option to <strong>cancel</strong> with a financial penalty has not opened yet.</p>);
    }
    return (<p>The option to <strong>cancel</strong> with a financial penalty has already closed.</p>);
}

const ContractTimeline = () => {
  const context: MacContextType = castContext();
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
  const context: MacContextType = castContext();
  if (context.state.employerActed) {
    return (<div>Employer has acted.</div>);
    }
    return (<div></div>);
}

const ContractorActed = () => {
  const context: MacContextType = castContext();
  if (context.state.contractorActed) {
    return (<div>Contractor has acted.</div>);
    }
    return (<div></div>);
}

const ArbiterActed = () => {
  const context: MacContextType = castContext();
  if (context.state.arbiterActed) {
    return (<div>Arbiter has acted.</div>);
    }
    return (<div></div>);
}

const WhoActed = () => {
    return (<div>
        <EmployerActed/>
        <ContractorActed/>
        <ArbiterActed/>
    </div>);
}



const InteractionUI = () => {
  const context: MacContextType = castContext();
  return (<div>
    <ConnectedAccount />
    <ContractTimeline />
    <WhoActed/>
    <TxIds/>
    <DeployButton/>
    <InitButton/>
    <DepositButton/>
    <WithdrawButton/>
    <SuccessButton/>
    <FailureButton/>
    <CancelButton/>
  </div>)
}

const InteractionEditor = () => {
  const context: MacContextType = castContext();
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
  const context: MacContextType = castContext();
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
            <h1>Interact with a <i>MAC!</i> contract</h1>
            <InteractionModeUI/>
            <InteractionCases />
        </article>);
}

export default Interaction;
