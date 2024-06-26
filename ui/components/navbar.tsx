import Link from "next/link";
import { MacContextType, CastContext, getNetworkNiceName } from "./AppContext";

import { WalletAURO, WalletPallad } from "../components/wallets";

const WalletSelectionComponent = () => {
  const context: MacContextType = CastContext();
  if (context.connectionButtonState == 0) {
    return (
      <select
        className="select select-bordered"
        onChange={async (event) => {
          if (event.target.value == "auro") {
            await context.setWallet(new WalletAURO());
          } else if (event.target.value == "pallad") {
            await context.setWallet(new WalletPallad());
          }
        }}
        defaultValue="auro"
      >
        <option value="auro">Auro Wallet</option>
        <option disabled value="pallad">
          Pallad
        </option>
      </select>
    );
  } else if (context.connectionButtonState == 1) {
    return (
      <select className="select select-bordered" defaultValue="auro" disabled>
        <option value="auro">Auro Wallet</option>
        <option disabled value="pallad">
          Pallad
        </option>
      </select>
    );
  }
  return;
};

const NetworkSelectionComponent = () => {
  const context: MacContextType = CastContext();
  if (context.compilationButtonState == 0) {
    return (
      <select
        className="select select-bordered"
        onChange={async (event) => {
          await context.setNetwork(event.target.value);
        }}
        defaultValue="devnet"
      >
        <option value="devnet">DevNet</option>
        <option disabled value="berkeley">
          Berkeley
        </option>
        <option disabled value="testworld">
          TestWorld
        </option>
        <option disabled>Mainnet</option>
      </select>
    );
  } else if (context.compilationButtonState == 1) {
    return (
      <select className="select select-bordered" defaultValue="devnet" disabled>
        <option value="devnet">DevNet</option>
        <option disabled value="berkeley">
          Berkeley
        </option>
        <option disabled value="testworld">
          TestWorld
        </option>
        <option disabled>Mainnet</option>
      </select>
    );
  }
  return;
};

const CircuitCompileButton = () => {
  const context: MacContextType = CastContext();
  const nice_name = getNetworkNiceName(context.network);
  if (context.compilationButtonState == 0) {
    if (context.connectionError !== "") {
      return (
        <div
          className="tooltip tooltip-open tooltip-bottom tooltip-error"
          data-tip={context.connectionError}
        >
          <button
            className="btn"
            onClick={() => {
              context.state.runLoadSnarkyJS(context);
            }}
          >
            Connect to {nice_name}
          </button>
        </div>
      );
    }
    return (
      <button
        className="btn"
        onClick={() => {
          context.state.runLoadSnarkyJS(context);
        }}
      >
        Connect to {nice_name}
      </button>
    );
  } else if (context.compilationButtonState == 1) {
    if (context.connectionError !== "") {
      return (
        <div
          className="tooltip tooltip-open tooltip-bottom tooltip-error"
          data-tip={context.connectionError}
        >
          <button className="btn btn-disabled animate-pulse">
            Connecting to {nice_name}...
          </button>
        </div>
      );
    }
    return (
      <button className="btn btn-disabled animate-pulse">
        Connecting to {nice_name}...
      </button>
    );
  } else if (
    context.compilationButtonState == 2 &&
    context.connectionButtonState <= 1
  ) {
    return <button className="btn btn-disabled">Compile Circuit</button>;
  } else if (
    context.compilationButtonState == 2 &&
    context.connectionButtonState > 1
  ) {
    return (
      <button
        className="btn"
        onClick={() => {
          context.state.runCompile(context);
        }}
      >
        Compile Circuit
      </button>
    );
  } else if (context.compilationButtonState == 3) {
    return (
      <button className="btn btn-disabled animate-pulse">Compiling...</button>
    );
  } else if (context.compilationButtonState == 4) {
    return <button className="btn btn-disabled">Circuit Compiled</button>;
  } else {
    return <button className="btn btn-disabled">Unknown</button>;
  }
};

const currentBlock = (blockchainLength: number) => {
  return "Block " + blockchainLength.toString();
};

const ConnectionError = () => {
  const context: MacContextType = CastContext();
  if (context.connectionError !== "") {
    return (
      <div
        className="tooltip tooltip-open tooltip-bottom tooltip-error"
        data-tip={context.connectionError}
      ></div>
    );
  }
  return <div></div>;
};

const ConnectButton = () => {
  const context: MacContextType = CastContext();
  if (context.compilationButtonState < 2) {
    return <button className="btn btn-disabled">Connect</button>;
  } else if (context.connectionButtonState == 0) {
    return (
      <button
        className="btn"
        onClick={() => {
          context.state.connectWallet(context);
        }}
      >
        Connect
      </button>
    );
  } else if (context.connectionButtonState == 1) {
    return (
      <button className="btn btn-disabled animate-pulse">Connecting...</button>
    );
  } else if (context.connectionButtonState == 2 && context.blockchainLength) {
    return (
      <div
        className="tooltip tooltip-open tooltip-bottom tooltip-accent"
        data-tip={currentBlock(context.blockchainLength)}
      >
        <button className="btn btn-disabled">Connected</button>
      </div>
    );
  } else if (context.connectionButtonState == 2) {
    return <button className="btn btn-disabled">Connected</button>;
  } else {
    return <button className="btn btn-disabled">Unknown</button>;
  }
};

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/create">New zkApp</Link>
            </li>
            <li>
              <Link href="/current">Interact</Link>
            </li>
            <li>
              <Link href="/close">Close</Link>
            </li>
            <li>
              <Link href="/import">Import zkApp</Link>
            </li>
            <li>
              <Link href="/export">Export zkApp</Link>
            </li>
            <li>
              <Link href="/funding">Funding</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          <i>MAC!</i>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <div className="dropdown">
          <label tabIndex={1} className="btn btn-ghost">
            <Link href="">zkApp</Link>
          </label>
          <ul
            tabIndex={1}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/create">New</Link>
            </li>
            <li>
              <Link href="/current">Interact</Link>
            </li>
            <li>
              <Link href="/close">Close</Link>
            </li>
            <li>
              <Link href="/import">Import</Link>
            </li>
            <li>
              <Link href="/export">Export</Link>
            </li>
          </ul>
        </div>
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/funding">Funding</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <NetworkSelectionComponent />
        <CircuitCompileButton />
        <WalletSelectionComponent />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
