import '../styles/globals.css';
import type { AppProps } from 'next/app';

import AppContext from '../components/AppContext';
import Layout from '../components/Layout';

import { createContext, useEffect, useState } from 'react';
import type { Mac } from '../../contracts/src/Mac';
import {
    Mina,
    Field,
    isReady,
    PrivateKey,
    PublicKey,
    fetchAccount,
} from 'snarkyjs';

import ZkappWorkerClient from './zkappWorkerClient';

async function runLoadSnarkyJS(state: FrontendState, setState) {
    console.log('runLoadSnarkyJS')
    // indicate it is compiling now
    setState({ ...state, comp_button_state: 1 });
    setTimeout(async () => {
        const zkappWorkerClient = new ZkappWorkerClient();
        setState({ ...state, comp_button_state: 1, zkappWorkerClient: zkappWorkerClient });
        console.log('loading SnarkyJS');
        await zkappWorkerClient.loadSnarkyJS();
        await zkappWorkerClient.setActiveInstanceToBerkeley();
        console.log('SnarkyJS loaded');
        console.log('loading contract')
        await zkappWorkerClient.loadContract();
        console.log('contract loaded');
        //console.log('blockchain length');
        const length = await zkappWorkerClient.fetchBlockchainLength();
        console.log(length);
        setState({
            ...state,
            comp_button_state: 2,
            zkappWorkerClient: zkappWorkerClient,
            blockchainLenght: length});
    }, 2000)
}

async function runCompile(state, setState) {
    console.log('runCompile')
    setState({ ...state, comp_button_state: 3 });
    try {
        console.log('compiling')
        await state.zkappWorkerClient.compileContract();
        console.log('compiled')
        setState({ ...state, comp_button_state: 4 });
    } catch (e:any) {
        setState({ ...state, comp_button_state: 2 });
    }
}

async function connectWallet(state, setState) {
    console.log('connectWallet')
    setState({ ...state, connect_button_state: 1 });
    setTimeout(async () => {
        setState({ ...state, connect_button_state: 1 });
        try {
                await state.zkappWorkerClient.setActiveInstanceToBerkeley();
            const mina = (window as any).mina;
            if (mina == null) {
                setState({ ...state, hasWallet: false });
                return;
            }
            const publicKeyBase58: string[] = await mina.requestAccounts();
            console.log('auro connected');
            console.log(publicKeyBase58);
            const publicKey = PublicKey.fromBase58(publicKeyBase58[0]);
            // let res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
            setState({ ...state, connect_button_state: 2, publicKey: publicKey });
            window.mina.on('accountsChanged', async (accounts: string[]) => {
                console.log('accountsChanged');
                console.log(accounts);
                if (accounts.length > 0) {
                    const publicKey = PublicKey.fromBase58(accounts[0]);
                    setState({ ...state, connect_button_state: 2, publicKey: publicKey });
                }
                // let res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
            });
        } catch (e:any) {
            setState({ ...state, connect_button_state: 0 });
        }
    }, 2000)
}

function MyApp({ Component, pageProps }: AppProps) {

    let [state, setState] = useState({
        zkappWorkerClient: null as null | ZkappWorkerClient,
        hasWallet: null as null | boolean,
        comp_button_state: 0,
        connect_button_state: 0,
        hasBeenSetup: false,
        accountExists: false,
        currentNum: null as null | Field,
        publicKey: null as null | PublicKey,
        zkappPrivateKeyCandidate: null as null | PrivateKey,
        zkappPublicKeyCandidate: null as null | PublicKey,
        zkappPrivateKey: null as null | PrivateKey,
        zkappPublicKey: null as null | PublicKey,
        creatingTransaction: false,
        runLoadSnarkyJS: runLoadSnarkyJS,
        runCompile: runCompile,
        connectWallet: connectWallet,
        loaded: false,
        deployed: false,
        initialized: false,
        macpack: 'Your MacPack will be here...',
        blockchainLength: null,
        tx_building_state: '',
        employerBase58: '',
        contract_employer: null as null | PublicKey,
        contract_contractor: null as null | PublicKey,
        contract_arbiter: null as null | PublicKey,
        contract_description: 'this is a description that is of the maximum length',
        contract_outcome_deposit_description: null as null | string,
        contract_outcome_deposit_after: null as null | number,
        contract_outcome_deposit_before: null as null | number,
        contract_outcome_deposit_employer: null as null | number,
        contract_outcome_deposit_contractor: null as null | number,
        contract_outcome_deposit_arbiter: null as null | number,
        contract_outcome_success_description: null as null | string,
        contract_outcome_success_after: null as null | number,
        contract_outcome_success_before: null as null | number,
        contract_outcome_success_employer: null as null | number,
        contract_outcome_success_contractor: null as null | number,
        contract_outcome_success_arbiter: null as null | number,
        contract_outcome_failure_description: null as null | string,
        contract_outcome_failure_after: null as null | number,
        contract_outcome_failure_before: null as null | number,
        contract_outcome_failure_employer: null as null | number,
        contract_outcome_failure_contractor: null as null | number,
        contract_outcome_failure_arbiter: null as null | number,
        contract_outcome_cancel_description: null as null | string,
        contract_outcome_cancel_after: null as null | number,
        contract_outcome_cancel_before: null as null | number,
        contract_outcome_cancel_employer: null as null | number,
        contract_outcome_cancel_contractor: null as null | number,
        contract_outcome_cancel_arbiter: null as null | number
    });


    // -------------------------------------------------------
    // Do Setup
    /*
       useEffect(() => {
       (async () => {
       if (!state.hasBeenSetup) {
       const zkappWorkerClient = new ZkappWorkerClient();
       console.log('Loading SnarkyJS...');
       await zkappWorkerClient.loadSnarkyJS();
       console.log('done');
       await zkappWorkerClient.setActiveInstanceToBerkeley();
       // TODO
       }
       })();
       }, []);
     */
    // -------------------------------------------------------

    return (
        <AppContext.Provider value={{ state, setState }}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppContext.Provider>
    )
}

export default MyApp
