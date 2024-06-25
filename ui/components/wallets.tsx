import {
  MacContextStateType,
  MacContextType,
  CastContext,
} from "../components/AppContext";

import {
  toastInfo,
  toastWarning,
  toastError,
  toastSuccess,
} from "../components/toast";

export interface WalletInterface {
  initialize(context: MacContextType): void;
  // sets wallet name

  getConnectedAddress(context: MacContextType): Promise<string>;
  // returns connected address

  sendTX(context: MacContextType, transactionJSON: any): Promise<string>;
  // returns transaction hash

  enableAccountsChangedListener(
    callback: (connected_account: string) => Promise<void>,
  ): void;

  disableAccountsChangedListener(
    callback: (connected_account: string) => Promise<void>,
  ): void;
}

export class WalletAURO implements WalletInterface {
  initialize(context: MacContextType): void {
    const mina = (window as any).mina;
    if (mina == null) {
      toastError("AuroWallet is not available");
      context.setState({
        ...context.state,
        hasWallet: false,
      });
    }
  }

  async getConnectedAddress(context: MacContextType): Promise<string> {
    const mina = (window as any).mina;
    if (mina == null) {
      toastError("AuroWallet is not available");
      context.setState({
        ...context.state,
        hasWallet: false,
      });
      return "";
    }
    const accounts: string[] = await mina.requestAccounts();
    if (accounts.length === 0) {
      return "";
    }
    return "";
  }

  async sendTX(context: MacContextType, transactionJSON: any): Promise<string> {
    const mina = (window as any).mina;
    if (mina == null) {
      toastError("AuroWallet is not available");
      context.setState({
        ...context.state,
        hasWallet: false,
      });
      return "";
    }
    const { hash } = await mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        memo: "",
      },
    });
    return hash;
  }

  enableAccountsChangedListener(
    callback: (connected_account: string) => Promise<void>,
  ): void {
    const mina = (window as any).mina;
    if (mina !== null) {
      const handler = async (accounts: string[]) => {
        if (accounts.length > 0) {
          await callback(accounts[0]);
        } else {
          accounts = await mina.requestAccounts();
          if (accounts.length > 0) {
            await callback(accounts[0]);
          }
        }
      };
      mina.on("accountsChanged", handler);
    }
  }

  disableAccountsChangedListener(
    callback: (connected_account: string) => Promise<void>,
  ): void {
    const mina = (window as any).mina;
    if (mina !== null) {
      const handler = async (accounts: string[]) => {
        if (accounts.length > 0) {
          await callback(accounts[0]);
        } else {
          accounts = await mina.requestAccounts();
          if (accounts.length > 0) {
            await callback(accounts[0]);
          }
        }
      };
      mina.off("accountsChanged", handler);
    }
  }
}

export class WalletPallad implements WalletInterface {
  initialize(context: MacContextType): void {}

  async getConnectedAddress(context: MacContextType): Promise<string> {
    return "";
  }

  async sendTX(context: MacContextType, transactionJSON: any): Promise<string> {
    return "";
  }

  enableAccountsChangedListener(
    callback: (connected_account: string) => Promise<void>,
  ): void {}

  disableAccountsChangedListener(
    callback: (connected_account: string) => Promise<void>,
  ): void {}
}
