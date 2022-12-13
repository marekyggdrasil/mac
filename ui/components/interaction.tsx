import Link from 'next/link';
import { useContext } from 'react';

import AppContext from './AppContext';
import { MinaValue } from './highlights';
import { RenderContractDescription } from './ContractRendering';

async function finalizeContract(context) {
    // instantiate preimage via worker and compute macpack
    context.state.zkappWorkerClient.definePreimage(
        context.state.zkappPublicKey.toBase58(),
        context.state.publicKey.toBase58(),
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

async function deployContract(context) {
    // TODO deploy the contract
    context.setState({ ...context.state, deployed: true });
}

const InteractionEditor = () => {
    const context = useContext(AppContext);
    if (!context.state.loaded) {
        return (<div>Below you may review your contract. If it is what you intended it to be you may run <button className="btn" onClick={async () => {
            await finalizeContract(context);
        }}>Finalize</button>.</div>);
    }
    if (!context.state.deployed) {
        if (!context.state.comp_button_state < 4) {
            return (
                <div>Your contract is finalized and is is already possible to <Link href="/export">export</Link> it using MacPacks. However, it is not available on-chain. Make sure you compile the zk-SNARK circuit first and then you may deploy it. Compilation will take between 7 and 20 minutes so make sure you have some nice show to watch in the meantime.</div>);
        } else {
            return (
                <div>Your contract is finalized and is is already possible to <Link href="/export">export</Link> it using MacPacks. However, it is not available on-chain. You may <button className="btn" onClick={async () => {
                    await deployContract(context);
                }}>Deploy</button> it now.</div>);
        }

    }
    return (
            <div>
                <h2>Interaction</h2>
                <div>Interacting as <MinaValue>{ context.state.publicKey.toBase58() }</MinaValue>. If you wish to use different account, open your AURO wallet and simply switch the account. Simple as that!</div>
            </div>);
}


const InteractionCases = () => {
    const context = useContext(AppContext);
    if (context.state.comp_button_state < 2) {
        return (<div>Make sure you load the SnarkyJS library!</div>);
    } else if (context.state.connect_button_state < 2) {
        return (<div>Make sure you connect your AuroWallet!</div>);
    } else {
        console.log('context public key');
        console.log(context.state.publicKey);
        // {context.state.publicKey.toBase58()}
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
