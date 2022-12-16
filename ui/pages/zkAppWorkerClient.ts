import {
  fetchAccount,
  PublicKey,
  PrivateKey,
    Field
} from 'snarkyjs'

import type { ZkappWorkerRequest, ZkappWorkerReponse, WorkerFunctions } from './zkappWorker';

export default class ZkappWorkerClient {

  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call('loadSnarkyJS', {});
  }

  setActiveInstanceToBerkeley() {
    return this._call('setActiveInstanceToBerkeley', {});
  }

  loadContract() {
    return this._call('loadContract', {});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

    async generatePrivateKey(): Promise<PrivateKey> {
        const result: string = await this._call('generatePrivateKey', {});
        return PrivateKey.fromBase58(result);
    }

  fetchAccount({ publicKey }: { publicKey: PublicKey }): ReturnType<typeof fetchAccount> {
      const result = this._call('fetchAccount', { publicKey58: publicKey.toBase58() });
    return (result as ReturnType<typeof fetchAccount>);
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call('initZkappInstance', { publicKey58: publicKey.toBase58() });
  }

  async getNum(): Promise<Field> {
    const result = await this._call('getNum', {});
    return Field.fromJSON(JSON.parse(result as string));
  }

    async fetchBlockchainLength(): Promise<number> {
        const value: string = await this._call('fetchBlockchainLength', {});
        return parseInt(value);
  }

    async fromMacPack(macpack: string) {
      await this._call('fromMacPack', { macpack: macpack});
  }

    async toMacPack() {
      return await this._call('toMacPack', {});
    }

    async getPreimageData() {
        const result = await this._call('getPreimageData', {});
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
        contract_outcome_cancel_arbiter: number) {
        await this._call('definePreimage', {
            address: address,
            employer: employer,
            contractor: contractor,
            arbiter: arbiter,
            contract_description: contract_description,
            contract_outcome_deposit_description: contract_outcome_deposit_description,
            contract_outcome_deposit_after: contract_outcome_deposit_after,
            contract_outcome_deposit_before: contract_outcome_deposit_before,
            contract_outcome_deposit_employer: contract_outcome_deposit_employer,
            contract_outcome_deposit_contractor: contract_outcome_deposit_contractor,
            contract_outcome_deposit_arbiter: contract_outcome_deposit_arbiter,
            contract_outcome_success_description: contract_outcome_success_description,
            contract_outcome_success_after: contract_outcome_success_after,
            contract_outcome_success_before: contract_outcome_success_before,
            contract_outcome_success_employer: contract_outcome_success_employer,
            contract_outcome_success_contractor: contract_outcome_success_contractor,
            contract_outcome_success_arbiter: contract_outcome_success_arbiter,
            contract_outcome_failure_description: contract_outcome_failure_description,
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
            contract_outcome_cancel_arbiter: contract_outcome_cancel_arbiter});
    }
    async sendTransaction() {
        const result = await this._call('sendTransaction', {});
        return JSON.parse(result);
    }
    async sendTransactionSign(deployerPrivateKey: PrivateKey) {
        const result = await this._call('sendTransactionSign', {
            deployerPrivateKey58: deployerPrivateKey.toBase58()});
        return JSON.parse(result);
    }
    async createDeployTransaction(privateKey: PrivateKey, deployerPrivateKey: PrivateKey) {
        return await this._call('createDeployTransaction', {
            privateKey58: privateKey.toBase58(),
            deployerPrivateKey58: deployerPrivateKey.toBase58()
        });
    }
    async createDeployTransactionAuro(privateKey: PrivateKey) {
        return await this._call('createDeployTransactionAuro', {
            privateKey58: privateKey.toBase58()
        });
    }

    async createInitTransaction(deployerPrivateKey: PrivateKey) {
        return await this._call('createInitTransaction', {
            deployerPrivateKey58: deployerPrivateKey.toBase58()
        });
    }
    async createInitTransactionAuro(actor: PrivateKey, deployerPrivateKey: PrivateKey) {
        return false;
    }

    async createDepositTransaction(actor: PublicKey, deployerPrivateKey: PrivateKey) {
        return await this._call('createDepositTransaction', {
            actorPublicKey58: actor.toBase58(),
            deployerPrivateKey58: deployerPrivateKey.toBase58()});
    }
    async createDepositTransactionAuro(actor: PublicKey) {
        return await this._call('createDepositTransaction', {
            actorPublicKey58: actor.toBase58()});
    }

    async createWithdrawTransactionAuro() {
        return await this._call('createWithdrawTransaction', {});
    }
    async createWithdrawTransaction(actor: PublicKey, deployerPrivateKey: PrivateKey) {
        return await this._call('createWithdrawTransaction', {
            actorPublicKey58: actor.toBase58(),
            deployerPrivateKey58: deployerPrivateKey.toBase58()});
    }

    async createSuccessTransactionAuro() {
        return await this._call('createSuccessTransaction', {});
    }
    async createSuccessTransaction(actor: PublicKey, deployerPrivateKey: PrivateKey) {
        return await this._call('createSuccessTransaction', {
            actorPublicKey58: actor.toBase58(),
            deployerPrivateKey58: deployerPrivateKey.toBase58()});
    }

    async createFailureTransaction(actor: PublicKey, deployerPrivateKey: PrivateKey) {
        return await this._call('createFailureTransaction', {
            actorPublicKey58: actor.toBase58(),
            deployerPrivateKey58: deployerPrivateKey.toBase58()});
    }
    async createFailureTransactionAuro() {
        return await this._call('createFailureTransaction', {});
    }

    async createCancelTransaction(actor: PublicKey, deployerPrivateKey: PrivateKey) {
        return await this._call('createCancelTransaction', {
            actorPublicKey58: actor.toBase58(),
            deployerPrivateKey58: deployerPrivateKey.toBase58()});
    }
    async createCancelTransactionAuro() {
        return await this._call('createCancelTransaction', {});
    }

    async getContractState() {
        return await this._call('getContractState', {});
    }

  async proveTransaction() {
    return await this._call('proveTransaction', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: { [id: number]: { resolve: (res: any) => void, reject: (err: any) => void } };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url))
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject }

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
