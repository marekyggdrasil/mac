import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

import { useEffect, useState } from 'react';
import type { Mac } from '../../contracts/src/Mac';
import {
    Mina,
    Field,
    isReady,
    PublicKey,
    fetchAccount,
} from 'snarkyjs';

async function runCompile(state, setState) {
    // indicate it is compiling now
    setState({ ...state, compiled: 1 });
    // TODO run the compilation of MAC here
    setTimeout(() => {
        // TODO once compile then set the state to compiled
        setState({ ...state, compiled: 2 });
    }, 15000)
}

function MyApp({ Component, pageProps }: AppProps) {
    let [state, setState] = useState({
        hasWallet: null as null | boolean,
        compiled: 0,
        hasBeenSetup: false,
        accountExists: false,
        currentNum: null as null | Field,
        publicKey: null as null | PublicKey,
        zkappPublicKey: null as null | PublicKey,
        creatingTransaction: false,
        runCompile: runCompile
    });
    return (
        <Layout state={state} setState={setState}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp
