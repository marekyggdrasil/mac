import { fetchAccount, PublicKey, PrivateKey, Field } from "o1js";

import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from "./zkAppWorker";

export default class ZkappWorkerClient {
  setActiveInstanceToNetwork(endpoint: string) {
    return this._call("setActiveInstanceToNetwork", {
      endpoint: endpoint
    });
  }

  loadContract() {
    return this._call("loadContract", {});
  }

  compileContract() {
    return this._call("compileContract", {});
  }

  async generatePrivateKey(): Promise<PrivateKey> {
    const result: string = await this._call("generatePrivateKey", {});
    return PrivateKey.fromBase58(result);
  }

  async fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    return await this._callFetchAccount("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  async fetchBlockchainLength(): Promise<number> {
    const value: string = await this._call("getBlockchainLength", {});
    return parseInt(value);
  }

  async fromMacPack(macpack: string) {
    await this._call("fromMacPack", { macpack: macpack });
  }

  async toMacPack() {
    return await this._call("toMacPack", {});
  }

  async getPreimageData() {
    const result = await this._call("getPreimageData", {});
    return JSON.parse(result);
  }

  async definePreimage(
    address: string,
    employer: string,
    contractor: string,
    arbiter: string,
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
    contract_outcome_cancel_arbiter: number,
  ) {
    await this._call("definePreimage", {
      address: address,
      employer: employer,
      contractor: contractor,
      arbiter: arbiter,
      contract_description: contract_description,
      contract_outcome_deposit_description:
        contract_outcome_deposit_description,
      contract_outcome_deposit_after: contract_outcome_deposit_after,
      contract_outcome_deposit_before: contract_outcome_deposit_before,
      contract_outcome_deposit_employer: contract_outcome_deposit_employer,
      contract_outcome_deposit_contractor: contract_outcome_deposit_contractor,
      contract_outcome_deposit_arbiter: contract_outcome_deposit_arbiter,
      contract_outcome_success_description:
        contract_outcome_success_description,
      contract_outcome_success_after: contract_outcome_success_after,
      contract_outcome_success_before: contract_outcome_success_before,
      contract_outcome_success_employer: contract_outcome_success_employer,
      contract_outcome_success_contractor: contract_outcome_success_contractor,
      contract_outcome_success_arbiter: contract_outcome_success_arbiter,
      contract_outcome_failure_description:
        contract_outcome_failure_description,
      contract_outcome_failure_after: contract_outcome_failure_after,
      contract_outcome_failure_before: contract_outcome_failure_before,
      contract_outcome_failure_employer: contract_outcome_failure_employer,
      contract_outcome_failure_contractor: contract_outcome_failure_contractor,
      contract_outcome_failure_arbiter: contract_outcome_failure_arbiter,
      contract_outcome_cancel_description: contract_outcome_cancel_description,
      contract_outcome_cancel_after: contract_outcome_cancel_after,
      contract_outcome_cancel_before: contract_outcome_cancel_before,
      contract_outcome_cancel_employer: contract_outcome_cancel_employer,
      contract_outcome_cancel_contractor: contract_outcome_cancel_contractor,
      contract_outcome_cancel_arbiter: contract_outcome_cancel_arbiter,
    });
  }

  async createDeployTransaction(
    zkAppPrivateKey: PrivateKey,
    feePayerAddress: PublicKey,
  ) {
    return await this._call("createDeployTransaction", {
      zkAppPrivateKey58: zkAppPrivateKey.toBase58(),
      feePayerAddress58: feePayerAddress.toBase58(),
    });
  }

  async createDepositTransaction(actor: PublicKey) {
    return await this._call("createDepositTransaction", {
      actorPublicKey58: actor.toBase58(),
    });
  }

  async createWithdrawTransaction(actor: PublicKey) {
    return await this._call("createWithdrawTransaction", {
      actorPublicKey58: actor.toBase58(),
    });
  }

  async createSuccessTransaction(actor: PublicKey) {
    return await this._call("createSuccessTransaction", {
      actorPublicKey58: actor.toBase58(),
    });
  }

  async createFailureTransaction(actor: PublicKey) {
    return await this._call("createFailureTransaction", {
      actorPublicKey58: actor.toBase58(),
    });
  }

  async createCancelTransaction(actor: PublicKey) {
    return await this._call("createCancelTransaction", {
      actorPublicKey58: actor.toBase58(),
    });
  }

  async getContractState() {
    return await this._call("getContractState", {});
  }

  async proveTransaction() {
    return await this._call("proveTransaction", {});
  }

  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      const response = event.data;
      if (response.error) {
        this.promises[response.id].reject(new Error(response.errorMessage));
      } else {
        this.promises[response.id].resolve(response.data);
      }
      delete this.promises[response.id];
    };
  }

  _call(fn: WorkerFunctions, args: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }

  _callFetchAccount(
    fn: WorkerFunctions,
    args: any,
  ): Promise<ReturnType<typeof fetchAccount>> {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
