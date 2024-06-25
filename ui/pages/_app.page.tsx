import React from "react";

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

import { WalletAURO } from "../components/wallets";

import Layout from "../components/Layout";
import {
  toastInfo,
  toastWarning,
  toastError,
  toastSuccess,
} from "../components/toast";

import { createContext, useEffect, useState, useContext } from "react";
import {
  Mina,
  Field,
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
  // toast.error("failed to create deploy transaction!");
  // toast(<ExampleToast />, {hideProgressBar: true});
  // toast("failed", {className: "alert alert-error"})
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
  const nice_name = getNetworkNiceName(context.network);
  const network_endpoint = getNetworkFromName(context.network);
  console.log("setting active instance to " + nice_name);
  console.log(network_endpoint);
  try {
    await zkappWorkerClient.setActiveInstanceToNetwork(network_endpoint);
  } catch (error) {
    console.log(
      "unfortunately the " + nice_name + " network is not reachable right now",
    );
    toastError("Failed to connect to " + nice_name);
    console.error(error);
    await context.setCompilationButtonState(0);
    await context.setConnectionError("Failed to reach " + nice_name);
    return;
  }

  // network reachable, proceed
  console.log("berkeley loaded");
  console.log("loading contract");
  await zkappWorkerClient.loadContract();
  console.log("contract loaded");
  console.log("blockchain length");
  let length = 0;
  try {
    length = await zkappWorkerClient.fetchBlockchainLength(network_endpoint);
  } catch (error) {
    console.log(error);
    console.log(
      "unfortunately the " +
        nice_name +
        " network is not reachable right now and we were not able to fetch the blockchain length",
    );
    toastError("Failed to fetch blockchain length from " + nice_name);
    await context.setCompilationButtonState(0);
    await context.setConnectionError(
      "Failed to fetch blockchain length from " + nice_name,
    );
    return;
  }
  await context.setBlockchainLength(length);
  await context.setBlockFetchDate(new Date());
  await context.setCompilationButtonState(2);
  await context.setConnectionError("");
  toastSuccess("Successfully connected to " + nice_name);
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
    toastSuccess("Successfully compiled the smart contract");
  } catch (e: any) {
    console.log(e);
    await context.setCompilationButtonState(2);
    toastError("Failed to compile the smart contract");
  }
}

async function connectWallet(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  //const auro: WalletAURO = new WalletAURO();
  console.log("connectWallet");
  await context.setConnectionButtonState(1);
  setTimeout(async () => {
    console.log("connectWallet action");
    await context.setConnectionButtonState(1);
    try {
      await context.wallet.initialize(context);
      const connected_address: string =
        await context.wallet.getConnectedAddress(context);
      if (connected_address != "") {
        context.setConnectedAddress(connected_address);
      }
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
    contractBuildInterfaceType: "wizard", // either "wizard" or "advanced"
    contractBuildWizardPage: 0,
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
    automatonState: "",
    employerBase58: "",
    contractorBase58: "",
    arbiterBase58: "",
    contract_nonce: null,
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
    contract_outcome_unresolved_after: -1,
    contract_outcome_unresolved_employer: -1,
    contract_outcome_unresolved_contractor: -1,
    contract_outcome_unresolved_arbiter: -1,
    editor_warm_up: 480,
    editor_deposit: 480,
    editor_execution: 480,
    editor_failure_declaraion: 480,
    unit_blockchain_length: false,
  };
  let [state, setState] = useState(initial_state);

  let [compilationButtonState, setCompilationButtonState] = useState(0);
  let [connectionButtonState, setConnectionButtonState] = useState(0);
  let [blockchainLength, setBlockchainLength] = useState(0);
  let [blockFetchDate, setBlockFetchDate] = useState(new Date());
  let [connectedAddress, setConnectedAddress] = useState("");
  let [connectionError, setConnectionError] = useState("");
  let [wallet, setWallet] = useState(new WalletAURO());
  let [network, setNetwork] = useState("devnet");
  let [txHash, setTxHash] = useState("");

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    if (!wallet) return;

    const handleAccountsChanged = async (connected_account: string) => {
      if (connected_account != "") {
        console.log("wallet changed account to:", connected_account);
        setConnectedAddress(connected_account);
      }
    };

    // Add the event listener
    wallet.enableAccountsChangedListener(handleAccountsChanged);

    // Clean up the event listener when the extension changes or the component unmounts
    return () => {
      wallet.disableAccountsChangedListener(handleAccountsChanged);
    };
  }, [wallet]);

  useEffect(() => {
    (async () => {
      const interval = setInterval(async () => {
        if (compilationButtonState > 1) {
          try {
            const endpoint = getNetworkFromName(network);
            const block = await fetchLastBlock(endpoint);
            const length = parseInt(block.blockchainLength.toString());
            if (length) {
              setBlockchainLength(length);
              setBlockFetchDate(new Date());
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
        blockFetchDate,
        setBlockFetchDate,
        connectionError,
        setConnectionError,
        connectedAddress,
        setConnectedAddress,
        wallet,
        setWallet,
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
