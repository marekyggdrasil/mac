import Link from 'next/link';

import ZkappWorkerClient from './zkAppWorkerClient';

import {
  MacContextType,
  castContext,
  castZkAppWorkerClient
} from '../components/AppContext';

import {
  PublicKey
} from 'o1js'

async function runImport(context: MacContextType) {
  let element = document.getElementById('import-macpack');
  if (element === null) {
    throw Error('Macpack container is missing');
  }
  let zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  let macpack = (element.innerText || element.textContent);
  console.log(macpack);
  try {
    if (macpack === null) {
      throw Error('Macpack value is null');
    }
    await zkappWorkerClient.fromMacPack(macpack);
    console.log('imported correctly');
    // get the preimage to app state for the display
    const r = await zkappWorkerClient.getPreimageData();
    console.log('preimage data');
        console.log(r);
        console.log(r.address);
        // context.setState({ ...context.state, loaded: true, macpack: macpack });

        let zkAppPublicKey: PublicKey = PublicKey.fromBase58(r.address);
    await zkappWorkerClient.initZkappInstance(zkAppPublicKey);
    const account = await zkappWorkerClient.fetchAccount(
      { publicKey: zkAppPublicKey });
    let is_deployed = false;
        if (account.account !== undefined) {
            is_deployed = true;
          const on_chain_state = await zkappWorkerClient.getContractState();
          console.log(on_chain_state);
        }

        // set the state
        context.setState({
                ...context.state,
                loaded: true,
                finalized: true,
                deployed: is_deployed,
                macpack: macpack,
                zkappPublicKey: zkAppPublicKey,
                contract_employer: PublicKey.fromBase58(r.employer),
                contract_contractor: PublicKey.fromBase58(r.contractor),
                contract_arbiter: PublicKey.fromBase58(r.arbiter),
                contract_outcome_deposit_after: r.contract_outcome_deposit_after,
                contract_outcome_deposit_before: r.contract_outcome_deposit_before,
                contract_outcome_success_after: r.contract_outcome_success_after,
                contract_outcome_success_before: r.contract_outcome_success_before,
                contract_outcome_failure_after: r.contract_outcome_failure_after,
                contract_outcome_failure_before: r.contract_outcome_failure_before,
                contract_outcome_cancel_after: r.contract_outcome_cancel_after,
                contract_outcome_cancel_before: r.contract_outcome_cancel_before,
                contract_description: r.contract_description,
                contract_outcome_deposit_description: r.contract_outcome_deposit_description,
                contract_outcome_success_description: r.contract_outcome_success_description,
                contract_outcome_failure_description: r.contract_outcome_failure_description,
                contract_outcome_cancel_description: r.contract_outcome_cancel_description,
                contract_outcome_deposit_employer: -r.contract_outcome_deposit_employer,
                contract_outcome_deposit_contractor: -r.contract_outcome_deposit_contractor,
                contract_outcome_deposit_arbiter: -r.contract_outcome_deposit_arbiter,
                contract_outcome_success_employer: r.contract_outcome_success_employer,
                contract_outcome_success_contractor: r.contract_outcome_success_contractor,
                contract_outcome_success_arbiter: r.contract_outcome_success_arbiter,
                contract_outcome_failure_employer: r.contract_outcome_failure_employer,
                contract_outcome_failure_contractor: r.contract_outcome_failure_contractor,
                contract_outcome_failure_arbiter: r.contract_outcome_failure_arbiter,
                contract_outcome_cancel_employer: r.contract_outcome_cancel_employer,
                contract_outcome_cancel_contractor: r.contract_outcome_cancel_contractor,
                contract_outcome_cancel_arbiter: r.contract_outcome_cancel_arbiter
            });
    } catch (e:any) {
        console.log('failed to import');
        console.log(e);
    }
}

const ImportCases = () => {
  const context: MacContextType = castContext();
  if (context.compilationButtonState < 2) {
    return (<div><p>You need to load the SnarkyJS library first!</p></div>);
    }
    if (context.state.loaded) {
        return (<div><p>You already have a loaded MAC! contract. Before you import another one make sure you <Link href="/close">close</Link> is first.</p></div>);
    }
    return (<div><p>The code section below is editable. Click on it and paste your MACPACK message.</p>
        <div className="rounded-md not-prose bg-primary text-primary-content">
            <div className="p-4">
                <code contentEditable="true" id="import-macpack">Paste your MACPACK here...
                </code>
            </div>
        </div>
        <p>Then hit the import button below!</p><button className="btn" onClick={async () => {
            await runImport(context);
        }}>Import</button></div>)
}


export default function _Import() {
    return (
        <div>
            <article className="container prose">
                <h1>Import Contract</h1>
                <ImportCases />
            </article>
        </div>
    )
}
