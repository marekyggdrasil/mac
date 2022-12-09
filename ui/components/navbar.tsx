import Link from 'next/link';

import { useContext } from 'react';
import AppContext from './AppContext'


const CircuitCompileButton = () => {
    const context = useContext(AppContext);
    console.log(context.state.comp_button_state);
    if (context.state.comp_button_state == 0) {
        console.log('state is 0');
        return <button className="btn" onClick={() => {
            context.state.runLoadSnarkyJS(context.state, context.setState);
        }}>
            Load SnarkyJS
        </button>;
    } else if (context.state.comp_button_state == 1) {
        console.log('state is 1');
        return <button className="btn btn-disabled animate-pulse">
            Loading SnarkyJS...
        </button>;
    } else if (context.state.comp_button_state == 2) {
        console.log('state is 2');
        return <button className="btn" onClick={() => {
            context.state.runCompile(context.state, context.setState);
        }}>
            Compile circuit
        </button>;
    } else if (context.state.comp_button_state == 3) {
        console.log('state is 3');
        return <button className="btn btn-disabled animate-pulse">
            Compiling...
        </button>;
    } else if (context.state.comp_button_state == 4) {
        console.log('state is 4');
        return <button className="btn btn-disabled">
            Circuit compiled!
        </button>;
    }
}


const ConnectButton = () => {
    const context = useContext(AppContext);
    console.log(context.state.connect_button_state);
    if (context.state.comp_button_state < 2) {
        return <button className="btn btn-disabled">
            Connect
        </button>;
    } else if (context.state.connect_button_state == 0) {
        console.log('state is 0');
        return <button className="btn" onClick={() => {
            context.state.connectWallet(context.state, context.setState);
        }}>
            Connect
        </button>;
    } else if (context.state.connect_button_state == 1) {
        console.log('state is 1');
        return <button className="btn btn-disabled animate-pulse">
            Connecting...
        </button>;
    } else if (context.state.connect_button_state == 2) {
        console.log('state is 2');
        return <button className="btn btn-disabled">
            Connected!
        </button>;
    }
}


const Navbar = () => {
    return (
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-100 rounded-box">
            <li><Link href="/">MAC</Link></li>
            <li tabIndex={0}>
                <span>Contract</span>
                <ul className="rounded-box bg-base-200 p-2">
                    <li className="menu-title">
                        <span>Create</span>
                    </li>
                    <li><Link href="/create">New</Link></li>
                    <li className="menu-title">
                        <span>Interact</span>
                    </li>
                    <li><Link href="/current">Current</Link></li>
                    <li><Link href="/close">Close</Link></li>
                    <li className="menu-title">
                        <span>IO</span>
                    </li>
                    <li><Link href="/import">Import</Link></li>
                    <li><Link href="/export">Export</Link></li>
                </ul>
            </li>
            <li><Link href="/about">About</Link></li>
            <li>
                <CircuitCompileButton />
            </li>
            <li>
                <ConnectButton />
            </li>
        </ul>
)}

export default Navbar;
