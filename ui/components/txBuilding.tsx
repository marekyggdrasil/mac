import ZkappWorkerClient from "../pages/zkAppWorkerClient";

import {
  MacContextType,
  CastContext,
  castZkAppWorkerClient,
} from "./AppContext";

import { finalizeContract } from "./interaction";

import { PublicKey, PrivateKey } from "o1js";

export async function contractDeploy(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "deploy",
  });
  if (!context.state.finalized) {
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  if (context.state.zkappPrivateKey === null) {
    throw Error("Private key is not defined");
  }
  await zkappWorkerClient.createDeployTransaction(
    context.state.zkappPrivateKey,
    connectedAddress,
  );
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  await zkappWorkerClient.proveTransaction();
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      memo: "",
    },
  });
  await context.setTxHash(hash);
  console.log("done");
  console.log(hash);
  await context.setTxHash(hash);
  await context.setState({
    ...context.state,
    creatingTransaction: false,
    deployed: true,
    tx_building_state: "",
    tx_command: "",
  });
}

export async function contractDeposit(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "deposit",
  });
  if (!context.state.finalized) {
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  await zkappWorkerClient.createDepositTransaction(connectedAddress);
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  await zkappWorkerClient.proveTransaction();
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      memo: "",
    },
  });
  await context.setTxHash(hash);
  console.log("done");
  console.log(hash);
  await context.setTxHash(hash);
  await context.setState({
    ...context.state,
    creatingTransaction: false,
    deployed: true,
    tx_building_state: "",
    tx_command: "",
  });
}

export async function contractWithdraw(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "withdraw",
  });
  if (!context.state.finalized) {
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  await zkappWorkerClient.createWithdrawTransaction(connectedAddress);
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  await zkappWorkerClient.proveTransaction();
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      memo: "",
    },
  });
  await context.setTxHash(hash);
  console.log("done");
  console.log(hash);
  await context.setTxHash(hash);
  await context.setState({
    ...context.state,
    creatingTransaction: false,
    deployed: true,
    tx_building_state: "",
    tx_command: "",
  });
}

export async function contractCancel(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "cancel",
  });
  if (!context.state.finalized) {
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  await zkappWorkerClient.createCancelTransaction(connectedAddress);
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  await zkappWorkerClient.proveTransaction();
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      memo: "",
    },
  });
  await context.setTxHash(hash);
  console.log("done");
  console.log(hash);
  await context.setTxHash(hash);
  await context.setState({
    ...context.state,
    creatingTransaction: false,
    deployed: true,
    tx_building_state: "",
    tx_command: "",
  });
}

export async function contractSuccess(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "success",
  });
  if (!context.state.finalized) {
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  await zkappWorkerClient.createSuccessTransaction(connectedAddress);
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  await zkappWorkerClient.proveTransaction();
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      memo: "",
    },
  });
  await context.setTxHash(hash);
  console.log("done");
  console.log(hash);
  await context.setTxHash(hash);
  await context.setState({
    ...context.state,
    creatingTransaction: false,
    deployed: true,
    tx_building_state: "",
    tx_command: "",
  });
}

export async function contractFailure(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "failure",
  });
  if (!context.state.finalized) {
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  await zkappWorkerClient.createFailureTransaction(connectedAddress);
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  await zkappWorkerClient.proveTransaction();
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      memo: "",
    },
  });
  await context.setTxHash(hash);
  console.log("done");
  console.log(hash);
  await context.setTxHash(hash);
  await context.setState({
    ...context.state,
    creatingTransaction: false,
    deployed: true,
    tx_building_state: "",
    tx_command: "",
  });
}
