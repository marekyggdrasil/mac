import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';

import { useEffect, useState } from 'react';
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

async function connectWallet(state, setState) {
    console.log('connectWallet')
    setState({ ...state, connect_button_state: 1 });
    setTimeout(async () => {
        setState({ ...state, connect_button_state: 1 });
        try {
            console.log('connecting')
            await state.zkappWorkerClient.setActiveInstanceToBerkeley();
            const mina = (window as any).mina;
            if (mina == null) {
                setState({ ...state, hasWallet: false });
                return;
            }
            const publicKeyBase58 : string = (await mina.requestAccounts())[0];
            const publicKey = PublicKey.fromBase58(publicKeyBase58);
            console.log('using key', publicKey.toBase58());
            console.log('checking if account exists...');
            const res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
            console.log('connected')
        } catch (e:any) {
            setState({ ...state, connect_button_state: 0 });
        } finally {
            setState({ ...state, connect_button_state: 2 });
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
        <Layout state={state} setState={setState}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp
