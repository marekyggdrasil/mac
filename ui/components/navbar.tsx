import Link from 'next/link';

import { useContext } from 'react';
import AppContext from './AppContext'


const CircuitCompileButton = () => {
    const context = useContext(AppContext);
    if (context.compilationButtonState == 0) {
        return <button className="btn" onClick={() => {
            context.state.runLoadSnarkyJS(context);
        }}>
            Load SnarkyJS
        </button>;
    } else if (context.compilationButtonState == 1) {
        return <button className="btn btn-disabled animate-pulse">
            Loading SnarkyJS...
        </button>;
    } else if (
        (context.compilationButtonState == 2) && (context.connectionButtonState <= 1)) {
        return <button className="btn btn-disabled">
            Compile circuit
        </button>;
    } else if (
        (context.compilationButtonState == 2) && (context.connectionButtonState > 1)) {
        return <button className="btn" onClick={() => {
            context.state.runCompile(context);
        }}>
            Compile circuit
        </button>;
    } else if (context.compilationButtonState == 3) {
        return <button className="btn btn-disabled animate-pulse">
            Compiling...
        </button>;
    } else if (context.compilationButtonState == 4) {
        return <button className="btn btn-disabled">
            Circuit compiled!
        </button>;
    }
}

const currentBlock = (blockchainLength) => {
    return "Block " + blockchainLength.toString();
}

const ConnectButton = () => {
    const context = useContext(AppContext);
    if (context.compilationButtonState < 2) {
        return <button className="btn btn-disabled">
            Connect
        </button>;
    } else if (context.connectionButtonState == 0) {
        return <button className="btn" onClick={() => {
            context.state.connectWallet(context);
        }}>
            Connect
        </button>;
    } else if (context.connectionButtonState == 1) {
        return <button className="btn btn-disabled animate-pulse">
            Connecting...
        </button>;
    } else if (
        (context.connectionButtonState == 2 && context.blockchainLength)) {
        return <div className="tooltip tooltip-open tooltip-bottom tooltip-accent" data-tip={currentBlock(context.blockchainLength)}>
            <button className="btn btn-disabled">Connected!</button>
        </div>;
    } else if (context.connectionButtonState == 2) {
        return <button className="btn btn-disabled">Connected!</button>;
    }
}

const Navbar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul  tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/create">New zkApp</Link></li>
                        <li><Link href="/current">Interact</Link></li>
                        <li><Link href="/close">Close</Link></li>
                        <li><Link href="/import">Import zkApp</Link></li>
                        <li><Link href="/export">Export zkApp</Link></li>
                        <li><Link href="/about">About</Link></li>
                    </ul>
                </div>
                <Link className="btn btn-ghost normal-case text-xl" href="/"><i>MAC!</i></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href="/create">New zkApp</Link></li>
                    <li><Link href="/current">Interact</Link></li>
                    <li><Link href="/close">Close</Link></li>
                    <li><Link href="/import">Import zkApp</Link></li>
                    <li><Link href="/export">Export zkApp</Link></li>
                    <li><Link href="/about">About</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <CircuitCompileButton /><ConnectButton />
            </div>
        </div>
)}

export default Navbar;
