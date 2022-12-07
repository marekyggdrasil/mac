import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

import { useEffect, useState } from 'react';
import type { Mac } from '../../contracts/src/';
import {
    Mina,
    Field,
    isReady,
    PublicKey,
    fetchAccount,
} from 'snarkyjs';

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
    });
    return (
        <Layout state={state}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp
