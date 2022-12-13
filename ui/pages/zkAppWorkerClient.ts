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

    async deploy(privateKey: PrivateKey) {
      await this._call('deploy', { privateKey58: privateKey.toBase58()});
  }

    async initialize(commitment: Field) {
      await this._call('initialize', { commitment: commitment.toJSON()});
  }

    async fromMacPack(macpack: string) {
      await this._call('fromMacPack', { macpack: macpack});
  }

    async toMacPack() {
      return await this._call('toMacPack', {});
  }

  createUpdateTransaction() {
    return this._call('createUpdateTransaction', {});
  }

  proveUpdateTransaction() {
    return this._call('proveUpdateTransaction', {});
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
