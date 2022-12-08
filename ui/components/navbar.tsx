import Link from 'next/link'

const CircuitCompileButton = ( {state, setState} ) => {
    const isCompiled = state.isLoggedIn;
    if (state.compiled == 0) {
        return <button className="btn" onClick={() => {
            state.runCompile(state, setState);
        }}>
            Compile
        </button>;
    } else if (state.compiled == 1) {
        return <button className="btn btn-disabled animate-pulse">
            Compiling...
        </button>;
    }
    return <button className="btn btn-disabled">
        Compiled!
    </button>;
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
            <li><button className="btn">Connect</button></li>
        </ul>
)}

export default Navbar
