import "../styles/globals.css";
import type { AppProps } from "next/app";

import {
  MacContextStateType,
  MacContextType,
  CastContext,
  castZkAppWorkerClient,
  AppContext,
  getNetworkFromName,
  getNetworkNiceName,
} from "../components/AppContext";

import Layout from "../components/Layout";

import { createContext, useEffect, useState, useContext } from "react";
import type { Mac } from "../../contracts/src/Mac";
import {
  Mina,
  Field,
  isReady,
  PrivateKey,
  PublicKey,
  fetchAccount,
  fetchLastBlock,
} from "o1js";

import ZkappWorkerClient from "./zkAppWorkerClient";

async function timeout(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

async function runLoadSnarkyJS(context: MacContextType) {
  console.log("runLoadSnarkyJS");
  // indicate it is compiling now
  await context.setCompilationButtonState(1);
  await context.setConnectionError("");
  console.log("loading web worker");
  const zkappWorkerClient = new ZkappWorkerClient();
  await timeout(5);
  console.log("done loading web worker");
  await context.setState({
    ...context.state,
    zkappWorkerClient: zkappWorkerClient,
  });
  console.log("setting active instance to berkeley");
  const network_endpoint = getNetworkFromName(context.network);
  const berkeley_state = await zkappWorkerClient.setActiveInstanceToNetwork(
    network_endpoint);
  if (berkeley_state !== "reachable") {
    console.log(
      "unfortunately the Berkeley network is not reachable right now",
    );
    await context.setCompilationButtonState(0);
    const nice_name = getNetworkNiceName(context.network);
    await context.setConnectionError("Failed to reach " + nice_name);
  } else {
    console.log("berkeley loaded");
    console.log("loading contract");
    await zkappWorkerClient.loadContract();
    console.log("contract loaded");
    console.log("blockchain length");
    const length = await zkappWorkerClient.fetchBlockchainLength();
    console.log(length);
    await context.setBlockchainLength(length);
    await context.setCompilationButtonState(2);
    await context.setConnectionError("");
  }
}

async function runCompile(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  console.log("runCompile");
  await context.setCompilationButtonState(3);
  try {
    console.log("compiling");
    console.time("contract-compilation");
    await zkappWorkerClient.compileContract();
    console.timeEnd("contract-compilation");
    console.log("compiled");
    await context.setCompilationButtonState(4);
  } catch (e: any) {
    console.log(e);
    await context.setCompilationButtonState(2);
  }
}

async function connectWallet(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  console.log("connectWallet");
  await context.setConnectionButtonState(1);
  setTimeout(async () => {
    await context.setConnectionButtonState(1);
    try {
      await zkappWorkerClient.setActiveInstanceToBerkeley();
      const mina = (window as any).mina;
      if (mina == null) {
        context.setState({
          ...context.state,
          hasWallet: false,
        });
        return;
      }
      const publicKeyBase58: string[] = await mina.requestAccounts();
      console.log("auro connected");
      console.log(publicKeyBase58);
      context.setConnectedAddress(publicKeyBase58[0]);
      await context.setConnectionButtonState(2);
    } catch (e: any) {
      console.log(e);
      await context.setConnectionButtonState(0);
    }
  }, 2000);
}

function MyApp({ Component, pageProps }: AppProps) {
  const initial_state: MacContextStateType = {
    zkappWorkerClient: null,
    hasWallet: false,
    hasBeenSetup: false,
    usingAuro: true,
    accountExists: false,
    currentNum: null,
    lastTxId: "",
    zkappPrivateKeyCandidate: null,
    zkappPublicKeyCandidate: PublicKey.empty(),
    zkappPrivateKey: null,
    zkappPublicKey: PublicKey.empty(),
    actorPublicKey: PublicKey.empty(),
    creatingTransaction: false,
    runLoadSnarkyJS: runLoadSnarkyJS,
    runCompile: runCompile,
    connectWallet: connectWallet,
    finalized: false,
    tx_command: "",
    loaded: false,
    deployed: false,
    initialized: false,
    macpack: "Your MacPack will be here...",
    tx_building_state: "",
    employerActed: false,
    contractorActed: false,
    arbiterActed: false,
    automatonState: false,
    employerBase58: "",
    contractorBase58: "",
    arbiterBase58: "",
    contract_employer: PublicKey.empty(),
    contract_contractor: PublicKey.empty(),
    contract_arbiter: PublicKey.empty(),
    contract_description: "this is a description that is of the maximum length",
    contract_outcome_deposit_description: "",
    contract_outcome_deposit_after: -1,
    contract_outcome_deposit_before: -1,
    contract_outcome_deposit_employer: -1,
    contract_outcome_deposit_contractor: -1,
    contract_outcome_deposit_arbiter: -1,
    contract_outcome_success_description: "",
    contract_outcome_success_after: -1,
    contract_outcome_success_before: -1,
    contract_outcome_success_employer: -1,
    contract_outcome_success_contractor: -1,
    contract_outcome_success_arbiter: -1,
    contract_outcome_failure_description: "",
    contract_outcome_failure_after: -1,
    contract_outcome_failure_before: -1,
    contract_outcome_failure_employer: -1,
    contract_outcome_failure_contractor: -1,
    contract_outcome_failure_arbiter: -1,
    contract_outcome_cancel_description: "",
    contract_outcome_cancel_after: -1,
    contract_outcome_cancel_before: -1,
    contract_outcome_cancel_employer: -1,
    contract_outcome_cancel_contractor: -1,
    contract_outcome_cancel_arbiter: -1,
  };
  let [state, setState] = useState(initial_state);

  let [compilationButtonState, setCompilationButtonState] = useState(0);
  let [connectionButtonState, setConnectionButtonState] = useState(0);
  let [blockchainLength, setBlockchainLength] = useState(0);
  let [connectedAddress, setConnectedAddress] = useState("");
  let [connectionError, setConnectionError] = useState("");
  let [network, setNetwork] = useState("berkeley");
  let [txHash, setTxHash] = useState("");

  // -------------------------------------------------------
  // Do Setup
  useEffect(() => {
    (async () => {
      const mina = (window as any).mina;
      if (mina === null) {
        throw Error("window.mina is not defined");
      }
      mina.on("accountsChanged", async (accounts: string[]) => {
        console.log("accountsChanged");
        console.log(accounts);
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0]);
        } else {
          return alert(
            "AURO wallet failed to provide MAC! with this account...",
          );
        }
        // let res = await state.zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
      });
      const interval = setInterval(async () => {
        if (compilationButtonState > 1) {
          try {
            const endpoint = getNetworkFromName(network);
            const block = await fetchLastBlock(endpoint);
            const length = parseInt(block.blockchainLength.toString());
            if (length) {
              setBlockchainLength(length);
            }
          } catch (e: unknown) {
            console.log("failed to fetch block :(");
          }
        }
      }, 60000);
      // return () => clearInterval(interval);
    })();
  }, []);

  // -------------------------------------------------------

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        compilationButtonState,
        setCompilationButtonState,
        connectionButtonState,
        setConnectionButtonState,
        blockchainLength,
        setBlockchainLength,
        connectionError,
        setConnectionError,
        connectedAddress,
        setConnectedAddress,
        network,
        setNetwork,
        txHash,
        setTxHash,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;
