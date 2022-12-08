import Link from 'next/link';

const CircuitCompileButton = ( {state, setState} ) => {
    console.log(state.comp_button_state);
    if (state.comp_button_state == 0) {
        console.log('state is 0');
        return <button className="btn" onClick={() => {
            state.runLoadSnarkyJS(state, setState);
        }}>
            Load SnarkyJS
        </button>;
    } else if (state.comp_button_state == 1) {
        console.log('state is 1');
        return <button className="btn btn-disabled animate-pulse">
            Loading SnarkyJS...
        </button>;
    } else if (state.comp_button_state == 2) {
        console.log('state is 2');
        return <button className="btn" onClick={() => {
            state.runCompile(state, setState);
        }}>
            Compile circuit
        </button>;
    } else if (state.comp_button_state == 3) {
        console.log('state is 3');
        return <button className="btn btn-disabled animate-pulse">
            Compiling...
        </button>;
    } else if (state.comp_button_state == 4) {
        console.log('state is 4');
        return <button className="btn btn-disabled">
            Circuit compiled!
        </button>;
    }
}


const ConnectButton = ( {state, setState} ) => {
    console.log(state.connect_button_state);
    if (state.comp_button_state < 2) {
        return <button className="btn btn-disabled">
            Connect
        </button>;
    } else if (state.connect_button_state == 0) {
        console.log('state is 0');
        return <button className="btn" onClick={() => {
            state.connectWallet(state, setState);
        }}>
            Connect
        </button>;
    } else if (state.connect_button_state == 1) {
        console.log('state is 1');
        return <button className="btn btn-disabled animate-pulse">
            Connecting...
        </button>;
    } else if (state.connect_button_state == 2) {
        console.log('state is 2');
        return <button className="btn btn-disabled">
            Connected!
        </button>;
    }
}


const Navbar = ( {state, setState} ) => {
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
                    <li>Close</li>
                    <li className="menu-title">
                        <span>IO</span>
                    </li>
                    <li><Link href="/import">Import</Link></li>
                    <li><Link href="/export">Export</Link></li>
                </ul>
            </li>
            <li><Link href="/about">About</Link></li>
            <li>
                <CircuitCompileButton state={state} setState={setState} />
            </li>
            <li>
                <ConnectButton state={state} setState={setState} />
            </li>
        </ul>
)}

export default Navbar
