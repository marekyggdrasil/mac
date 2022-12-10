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
        console.log('SnarkyJS loaded')
        setState({ ...state, comp_button_state: 2, zkappWorkerClient: zkappWorkerClient });
    }, 2000)
}

async function runCompile(state, setState) {
    console.log('runCompile')
    setState({ ...state, comp_button_state: 3 });
    try {
        console.log('loading contract')
        await state.zkappWorkerClient.loadContract();
        console.log('compiling')
        await state.zkappWorkerClient.compileContract();
        console.log('compiled')
    } catch (e:any) {
        setState({ ...state, comp_button_state: 2 });
    } finally {
        setState({ ...state, comp_button_state: 4 });
    }
}

async function handleMinaAccount(publicKeyBase58: string) {
    const publicKey = PublicKey.fromBase58(publicKeyBase58);
    return await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
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
            const publicKeyBase58 : string = (await mina.requestAccounts())[0];
            const publicKey = PublicKey.fromBase58(publicKeyBase58);
            console.log('setting the public key');
            console.log(publicKey);
            let res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
            setState({ ...state, connect_button_state: 2, publicKey: publicKey });
            window.mina.on('accountsChanged', async (accounts: string[]) => {
                const publicKeyBase58 : string = accounts[0];
                const publicKey = PublicKey.fromBase58(publicKeyBase58);
                console.log('setting the public key');
                console.log(publicKey);
                let res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
                setState({ ...state, connect_button_state: 2, publicKey: publicKey });
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
        zkappPublicKey: null as null | PublicKey,
        creatingTransaction: false,
        runLoadSnarkyJS: runLoadSnarkyJS,
        runCompile: runCompile,
        connectWallet: connectWallet
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
