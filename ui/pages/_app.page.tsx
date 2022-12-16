import '../styles/globals.css';
import type { AppProps } from 'next/app';

import AppContext from '../components/AppContext';
import Layout from '../components/Layout';

import { createContext, useEffect, useState, useContext } from 'react';
import type { Mac } from '../../contracts/src/Mac';
import {
    Mina,
    Field,
    isReady,
    PrivateKey,
    PublicKey,
    fetchAccount,
    fetchLastBlock
} from 'snarkyjs';

import ZkappWorkerClient from './zkappWorkerClient';

async function runLoadSnarkyJS(context) {
    console.log('runLoadSnarkyJS')
    // indicate it is compiling now
    await context.setCompilationButtonState(1);
    setTimeout(async () => {
        const zkappWorkerClient = new ZkappWorkerClient();
        await context.setState({
            ...context.state,
            zkappWorkerClient: zkappWorkerClient });
        console.log('loading SnarkyJS');
        await zkappWorkerClient.loadSnarkyJS();
        await zkappWorkerClient.setActiveInstanceToBerkeley();
        console.log('SnarkyJS loaded');
        console.log('loading contract')
        await zkappWorkerClient.loadContract();
        console.log('contract loaded');
        console.log('blockchain length');
        const length = await zkappWorkerClient.fetchBlockchainLength();
        console.log(length);
        await context.setBlockchainLength(length);
        await context.setCompilationButtonState(2);
    }, 2000)
}

async function runCompile(context) {
    console.log('runCompile');
    await context.setCompilationButtonState(3);
    try {
        console.log('compiling');
        await context.state.zkappWorkerClient.compileContract();
        console.log('compiled');
        await context.setCompilationButtonState(4);
    } catch (e:any) {
        console.log(e);
        await context.setCompilationButtonState(2);
    }
}

async function connectWallet(context) {
    console.log('connectWallet');
    await context.setConnectionButtonState(1);
    setTimeout(async () => {
        await context.setConnectionButtonState(1);
        try {
            await context.state.zkappWorkerClient.setActiveInstanceToBerkeley();
            const mina = (window as any).mina;
            if (mina == null) {
                context.setState({
                    ...context.state, hasWallet: false
                });
                return;
            }
            const publicKeyBase58: string[] = await mina.requestAccounts();
            console.log('auro connected');
        console.log(publicKeyBase58);
            context.setConnectedAddress(publicKeyBase58[0]);
            await context.setConnectionButtonState(2);
        } catch (e:any) {
            console.log(e);
            await context.setConnectionButtonState(0);
        }
    }, 2000)
}

function MyApp({ Component, pageProps }: AppProps) {

    let [state, setState] = useState({
        zkappWorkerClient: null as null | ZkappWorkerClient,
        hasWallet: null as null | boolean,
        hasBeenSetup: false,
        usingAuro: true,
        accountExists: false,
        currentNum: null as null | Field,
        lastTxId: '',
        zkappPrivateKeyCandidate: null as null | PrivateKey,
        zkappPublicKeyCandidate: null as null | PublicKey,
        zkappPrivateKey: null as null | PrivateKey,
        zkappPublicKey: null as null | PublicKey,
        actorPrivateKey: null as null | PrivateKey,
        actorPublicKey: null as null | PublicKey,
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
        employerActed: false,
        contractorActed: false,
        arbiterActed: false,
        automatonState: false,
        employerBase58: '',
        contractorBase58: '',
        arbiterBase58: '',
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


    let [compilationButtonState, setCompilationButtonState] = useState(0);
    let [connectionButtonState, setConnectionButtonState] = useState(0);
    let [blockchainLength, setBlockchainLength] = useState(null);
    let [connectedAddress, setConnectedAddress] = useState('');
    let [txHash, setTxHash] = useState('');

    // -------------------------------------------------------
    // Do Setup
    useEffect(() => {(async () => {
            const mina = (window as any).mina;
            window.mina.on('accountsChanged', async (accounts: string[]) => {
                console.log('accountsChanged');
                console.log(accounts);
                if (accounts.length > 0) {
                    setConnectedAddress(accounts[0]);
                } else {
                    return alert('AURO wallet failed to provide MAC! with this account...');
                }
                // let res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });

            });
        const interval = setInterval(async () => {
            const block = await fetchLastBlock(
                    "https://proxy.berkeley.minaexplorer.com/graphql");
            const length = parseInt(block.blockchainLength.toString());
            if (length) {
                setBlockchainLength(length);
            }
        }, 60000);
        // return () => clearInterval(interval);
    })();
    }, []);
    
    // -------------------------------------------------------

    return (
        <AppContext.Provider value={{
            state, setState,
            compilationButtonState, setCompilationButtonState,
            connectionButtonState, setConnectionButtonState,
            blockchainLength, setBlockchainLength,
            connectedAddress, setConnectedAddress,
            txHash, setTxHash}}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppContext.Provider>
    )
}

export default MyApp
