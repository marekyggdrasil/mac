import {
  toastInfo,
  toastWarning,
  toastError,
  toastSuccess,
} from "../components/toast";
import ZkappWorkerClient from "../pages/zkAppWorkerClient";

import {
  MacContextType,
  CastContext,
  castZkAppWorkerClient,
} from "./AppContext";

import { finalizeContract } from "./interaction";

import { PublicKey, PrivateKey } from "o1js";

export async function contractDeploy(context: MacContextType) {
  console.log("contractDeploy run");
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  const transactionFee = 0.1;
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Preparing...",
    tx_command: "deploy",
  });
  if (!context.state.finalized) {
    console.log("not finalized, finalizing");
    await finalizeContract(context);
  }
  const connectedAddress58: string = context.connectedAddress;
  console.log("connected address", connectedAddress58);
  const connectedAddress: PublicKey = PublicKey.fromBase58(connectedAddress58);
  console.log("fetchAccount");
  await zkappWorkerClient.fetchAccount({ publicKey: connectedAddress });
  console.log("initZkappInstance");
  await zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
  console.log("createDeployTransaction");
  if (context.state.zkappPrivateKey === null) {
    throw Error("Private key is not defined");
    toastError("Smart contract private key is missing");
  }
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Building...",
  });
  try {
    await zkappWorkerClient.createDeployTransaction(
      context.state.zkappPrivateKey,
      connectedAddress,
    );
  } catch (e: any) {
    console.log("failed to create deploy transaction!");
    console.log(e);
    toastError("Failed to construct the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction constructed, now wait for proving.");
  console.log("setState");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  try {
    await zkappWorkerClient.proveTransaction();
  } catch (e: any) {
    toastError("Failed to prove the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction proved!");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const hash = await context.wallet.sendTX(context, transactionJSON);
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
  toastSuccess("Transaction sent!");
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
  console.log("createDepositTransaction");
  try {
    await zkappWorkerClient.createDepositTransaction(connectedAddress);
  } catch (e: any) {
    console.log("failed to create the transaction!");
    console.log(e);
    toastError("Failed to construct the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction constructed, now wait for proving.");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  try {
    await zkappWorkerClient.proveTransaction();
  } catch (e: any) {
    toastError("Failed to prove the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction proved!");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const hash = await context.wallet.sendTX(context, transactionJSON);
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
  toastSuccess("Transaction sent!");
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
  console.log("createWithdrawTransaction");
  try {
    await zkappWorkerClient.createWithdrawTransaction(connectedAddress);
  } catch (e: any) {
    console.log("failed to create the transaction!");
    console.log(e);
    toastError("Failed to construct the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction constructed, now wait for proving.");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  try {
    await zkappWorkerClient.proveTransaction();
  } catch (e: any) {
    toastError("Failed to prove the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction proved!");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const hash = await context.wallet.sendTX(context, transactionJSON);
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
  toastSuccess("Transaction sent!");
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
  console.log("createCancelTransaction");
  try {
    await zkappWorkerClient.createCancelTransaction(connectedAddress);
  } catch (e: any) {
    console.log("failed to create the transaction!");
    console.log(e);
    toastError("Failed to construct the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction constructed, now wait for proving.");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  try {
    await zkappWorkerClient.proveTransaction();
  } catch (e: any) {
    toastError("Failed to prove the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction proved!");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const hash = await context.wallet.sendTX(context, transactionJSON);
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
  toastSuccess("Transaction sent!");
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
  console.log("createSuccessTransaction");
  try {
    await zkappWorkerClient.createSuccessTransaction(connectedAddress);
  } catch (e: any) {
    console.log("failed to create the transaction!");
    console.log(e);
    toastError("Failed to construct the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction constructed, now wait for proving.");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  try {
    await zkappWorkerClient.proveTransaction();
  } catch (e: any) {
    toastError("Failed to prove the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction proved!");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const hash = await context.wallet.sendTX(context, transactionJSON);
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
  toastSuccess("Transaction sent!");
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
  console.log("createFailureTransaction");
  try {
    await zkappWorkerClient.createFailureTransaction(connectedAddress);
  } catch (e: any) {
    console.log("failed to create the transaction!");
    console.log(e);
    toastError("Failed to construct the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction constructed, now wait for proving.");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Proving...",
  });
  console.log("proveTransaction");
  try {
    await zkappWorkerClient.proveTransaction();
  } catch (e: any) {
    toastError("Failed to prove the transaction");
    await context.setState({
      ...context.state,
      creatingTransaction: false,
      deployed: false,
      tx_building_state: "",
      tx_command: "",
    });
    return;
  }
  toastInfo("Transaction proved!");
  await context.setState({
    ...context.state,
    creatingTransaction: true,
    tx_building_state: "Initiating...",
  });
  console.log("getTransactionJSON");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();
  console.log(transactionJSON);
  const hash = await context.wallet.sendTX(context, transactionJSON);
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
  toastSuccess("Transaction sent!");
}
