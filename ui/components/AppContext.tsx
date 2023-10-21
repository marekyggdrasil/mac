import { createContext, useContext } from 'react';

import {
  Field,
  PrivateKey,
  PublicKey
} from 'snarkyjs';

import ZkappWorkerClient from '../pages/zkAppWorkerClient';

export type MacContextStateType = {
  zkappWorkerClient: ZkappWorkerClient | null,
  finalized: boolean,
  hasWallet: boolean,
  hasBeenSetup: boolean,
  usingAuro: boolean,
  accountExists: boolean,
  tx_command: string,
  currentNum: Field,
  lastTxId: string,
  zkappPrivateKeyCandidate: PrivateKey,
  zkappPublicKeyCandidate: PublicKey,
  zkappPrivateKey: PrivateKey,
  zkappPublicKey: PublicKey,
  actorPrivateKey: PrivateKey,
  actorPublicKey: PublicKey,
  creatingTransaction: boolean,
  runLoadSnarkyJS: Function,
  runCompile: Function,
  connectWallet: Function,
  loaded: boolean,
  deployed: boolean,
  initialized: boolean,
  macpack: string,
  tx_building_state: string,
  employerActed: boolean,
  contractorActed: boolean,
  arbiterActed: boolean,
  automatonState: boolean,
  employerBase58: string,
  contractorBase58: string,
  arbiterBase58: string,
  contract_employer: PublicKey,
  contract_contractor: PublicKey,
  contract_arbiter: PublicKey,
  contract_description: string,
  contract_outcome_deposit_description: string,
  contract_outcome_deposit_after: number,
  contract_outcome_deposit_before: number,
  contract_outcome_deposit_employer: number,
  contract_outcome_deposit_contractor: number,
  contract_outcome_deposit_arbiter: number,
  contract_outcome_success_description: string,
  contract_outcome_success_after: number,
  contract_outcome_success_before: number,
  contract_outcome_success_employer: number,
  contract_outcome_success_contractor: number,
  contract_outcome_success_arbiter: number,
  contract_outcome_failure_description: string,
  contract_outcome_failure_after: number,
  contract_outcome_failure_before: number,
  contract_outcome_failure_employer: number,
  contract_outcome_failure_contractor: number,
  contract_outcome_failure_arbiter: number,
  contract_outcome_cancel_description: string,
  contract_outcome_cancel_after: number,
  contract_outcome_cancel_before: number,
  contract_outcome_cancel_employer: number,
  contract_outcome_cancel_contractor: number,
  contract_outcome_cancel_arbiter: number
}

export type MacContextType = {
  state: MacContextStateType,
  setState: Function
  compilationButtonState: number,
  setCompilationButtonState: Function,
  connectionButtonState: number,
  setConnectionButtonState: Function,
  blockchainLength: number,
  setBlockchainLength: Function,
  connectedAddress: string,
  setConnectedAddress: Function,
  txHash: string,
  setTxHash: Function
}

export const AppContext = createContext<MacContextType | null>(null);

export function castContext(): MacContextType {
  const context = useContext(AppContext)
  if (context === null) {
    throw Error('Context is not defined');
  }
  if (context.state === null) {
    throw Error('Context state is not defined');
  }
  return context;
}

export function castZkAppWorkerClient(context: MacContextType): ZkappWorkerClient {
  if (context.state.zkappWorkerClient === null) {
    throw Error('context.state.zkappWorkerClient is not defined, first load snarkyjs library');
  }
  return context.state.zkappWorkerClient;
}
