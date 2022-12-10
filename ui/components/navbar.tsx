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
                <Link className="btn btn-ghost normal-case text-xl" href="/">MAC!</Link>
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
