import { createContext, useContext } from "react";

import { Field, PrivateKey, PublicKey } from "o1js";

import ZkappWorkerClient from "../pages/zkAppWorkerClient";

export interface ContractStateActedType {
  employer: boolean;
  contractor: boolean;
  arbiter: boolean;
}

export interface ContractStateType {
  acted: ContractStateActedType;
  automaton_state: string;
}

export type MacContextStateType = {
  zkappWorkerClient: ZkappWorkerClient | null;
  finalized: boolean;
  hasWallet: boolean;
  hasBeenSetup: boolean;
  usingAuro: boolean;
  accountExists: boolean;
  tx_command: string;
  currentNum: Field | null;
  lastTxId: string;
  contractBuildInterfaceType: string;  // either "wizard" or "advanced"
  contractBuildWizardPage: number;
  zkappPrivateKeyCandidate: PrivateKey | null;
  zkappPublicKeyCandidate: PublicKey;
  zkappPrivateKey: PrivateKey | null;
  zkappPublicKey: PublicKey;
  actorPublicKey: PublicKey;
  creatingTransaction: boolean;
  runLoadSnarkyJS: Function;
  runCompile: Function;
  connectWallet: Function;
  loaded: boolean;
  deployed: boolean;
  initialized: boolean;
  macpack: string;
  tx_building_state: string;
  employerActed: boolean;
  contractorActed: boolean;
  arbiterActed: boolean;
  automatonState: string;
  employerBase58: string;
  contractorBase58: string;
  arbiterBase58: string;
  contract_employer: PublicKey;
  contract_contractor: PublicKey;
  contract_arbiter: PublicKey;
  contract_description: string;
  contract_outcome_deposit_description: string;
  contract_outcome_deposit_after: number;
  contract_outcome_deposit_before: number;
  contract_outcome_deposit_employer: number;
  contract_outcome_deposit_contractor: number;
  contract_outcome_deposit_arbiter: number;
  contract_outcome_success_description: string;
  contract_outcome_success_after: number;
  contract_outcome_success_before: number;
  contract_outcome_success_employer: number;
  contract_outcome_success_contractor: number;
  contract_outcome_success_arbiter: number;
  contract_outcome_failure_description: string;
  contract_outcome_failure_after: number;
  contract_outcome_failure_before: number;
  contract_outcome_failure_employer: number;
  contract_outcome_failure_contractor: number;
  contract_outcome_failure_arbiter: number;
  contract_outcome_cancel_description: string;
  contract_outcome_cancel_after: number;
  contract_outcome_cancel_before: number;
  contract_outcome_cancel_employer: number;
  contract_outcome_cancel_contractor: number;
  contract_outcome_cancel_arbiter: number;
};

export type MacContextType = {
  state: MacContextStateType;
  setState: Function;
  compilationButtonState: number;
  setCompilationButtonState: Function;
  connectionButtonState: number;
  setConnectionButtonState: Function;
  blockchainLength: number;
  setBlockchainLength: Function;
  connectionError: string;
  setConnectionError: Function;
  connectedAddress: string;
  setConnectedAddress: Function;
  network: string;
  setNetwork: Function;
  txHash: string;
  setTxHash: Function;
};

export const AppContext = createContext<MacContextType | null>(null);

export function CastContext(): MacContextType {
  const context = useContext(AppContext);
  if (context === null) {
    throw Error("Context is not defined");
  }
  if (context.state === null) {
    throw Error("Context state is not defined");
  }
  return context;
}

export function castZkAppWorkerClient(
  context: MacContextType,
): ZkappWorkerClient {
  if (context.state.zkappWorkerClient === null) {
    throw Error(
      "context.state.zkappWorkerClient is not defined, first load snarkyjs library",
    );
  }
  return context.state.zkappWorkerClient;
}

export function getNetworkFromName(name: string): string {
  if (name === "berkeley") {
    return "https://proxy.berkeley.minaexplorer.com/graphql";
  }
  if (name === "testworld") {
    return "https://proxy.testworld.minaexplorer.com/graphql";
  }
  throw Error("unknown network");
}

export function getNetworkNiceName(name: string): string {
  if (name === "berkeley") {
    return "Berkeley";
  }
  if (name === "testworld") {
    return "TestWorld 2";
  }
  throw Error("unknown network");
}

export function getTransactionBlockExplorerURL(
  name: string,
  txid: string,
): string {
  if (name === "berkeley") {
    return "https://minascan.io/berkeley/tx/" + txid;
  }
  if (name === "testworld") {
    return "https://minascan.io/testworld/tx/" + txid;
  }
  throw Error("unknown network");
}

// the MINA block time for real-time contract interaction estimations
export function getBlockTime(): number {
  return 180.0;
}
