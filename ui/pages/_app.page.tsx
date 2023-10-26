import '../styles/globals.css';
import type { AppProps } from 'next/app';

import {
  MacContextStateType,
  MacContextType,
  castContext,
  castZkAppWorkerClient,
  AppContext
} from '../components/AppContext';

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

import ZkappWorkerClient from './zkAppWorkerClient';

async function runLoadSnarkyJS(context: MacContextType) {
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

async function runCompile(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  console.log('runCompile');
  await context.setCompilationButtonState(3);
    try {
      console.log('compiling');
      console.time('contract-compilation')
      await zkappWorkerClient.compileContract();
      console.timeEnd('contract-compilation')
      console.log('compiled');
        await context.setCompilationButtonState(4);
    } catch (e:any) {
        console.log(e);
        await context.setCompilationButtonState(2);
    }
}

async function connectWallet(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  console.log('connectWallet');
  await context.setConnectionButtonState(1);
    setTimeout(async () => {
        await context.setConnectionButtonState(1);
        try {
          await zkappWorkerClient.setActiveInstanceToBerkeley();
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

  const initial_state: MacContextStateType = {
    zkappWorkerClient: null,
    hasWallet: false,
    hasBeenSetup: false,
    usingAuro: true,
    accountExists: false,
    currentNum: null,
    lastTxId: '',
    zkappPrivateKeyCandidate: new PrivateKey(),
    zkappPublicKeyCandidate: new PublicKey(),
    zkappPrivateKey: new PrivateKey(),
    zkappPublicKey: new PublicKey(),
    actorPrivateKey: new PrivateKey(),
    actorPublicKey: new PublicKey(),
    creatingTransaction: false,
    runLoadSnarkyJS: runLoadSnarkyJS,
    runCompile: runCompile,
    connectWallet: connectWallet,
    finalized: false,
    tx_command: '',
    loaded: false,
    deployed: false,
    initialized: false,
    macpack: 'Your MacPack will be here...',
    tx_building_state: '',
    employerActed: false,
    contractorActed: false,
    arbiterActed: false,
    automatonState: false,
    employerBase58: '',
    contractorBase58: '',
    arbiterBase58: '',
    contract_employer: new PublicKey(),
    contract_contractor: new PublicKey(),
    contract_arbiter: new PublicKey(),
    contract_description: 'this is a description that is of the maximum length',
    contract_outcome_deposit_description: '',
    contract_outcome_deposit_after: -1,
    contract_outcome_deposit_before: -1,
    contract_outcome_deposit_employer: -1,
    contract_outcome_deposit_contractor: -1,
    contract_outcome_deposit_arbiter: -1,
    contract_outcome_success_description: '',
    contract_outcome_success_after: -1,
    contract_outcome_success_before: -1,
    contract_outcome_success_employer: -1,
    contract_outcome_success_contractor: -1,
    contract_outcome_success_arbiter: -1,
    contract_outcome_failure_description: '',
    contract_outcome_failure_after: -1,
    contract_outcome_failure_before: -1,
    contract_outcome_failure_employer: -1,
    contract_outcome_failure_contractor: -1,
    contract_outcome_failure_arbiter: -1,
    contract_outcome_cancel_description: '',
    contract_outcome_cancel_after: -1,
    contract_outcome_cancel_before: -1,
    contract_outcome_cancel_employer: -1,
    contract_outcome_cancel_contractor: -1,
    contract_outcome_cancel_arbiter: -1
  };
  let [state, setState] = useState(initial_state);

  let [compilationButtonState, setCompilationButtonState] = useState(0);
    let [connectionButtonState, setConnectionButtonState] = useState(0);
    let [blockchainLength, setBlockchainLength] = useState(0);
    let [connectedAddress, setConnectedAddress] = useState('');
    let [txHash, setTxHash] = useState('');

    // -------------------------------------------------------
    // Do Setup
    useEffect(() => {(async () => {
            const mina = (window as any).mina;
      if (mina === null) {
        throw Error('window.mina is not defined');
      }
      mina.on('accountsChanged', async (accounts: string[]) => {
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
          state,
          setState,
          compilationButtonState,
          setCompilationButtonState,
          connectionButtonState,
          setConnectionButtonState,
          blockchainLength,
          setBlockchainLength,
          connectedAddress,
          setConnectedAddress,
          txHash,
          setTxHash}}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppContext.Provider>
    )
}

export default MyApp
