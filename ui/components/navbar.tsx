const CircuitCompileButton = ( {state, setState} ) => {
    const isCompiled = state.isLoggedIn;
    if (state.compiled == 0) {
        return <button className="btn" onClick={() => {
            console.log(typeof(setState));
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
            <li><a href="/">MAC</a></li>
            <li tabIndex={0}>
                <span>Contract</span>
                <ul className="rounded-box bg-base-200 p-2">
                    <li className="menu-title">
                        <span>Create</span>
                    </li>
                    <li><a href="/create">New</a></li>
                    <li className="menu-title">
                        <span>Interact</span>
                    </li>
                    <li><a href="/current">Current</a></li>
                    <li><a>Close</a></li>
                    <li className="menu-title">
                        <span>IO</span>
                    </li>
                    <li><a href="/import">Import</a></li>
                    <li><a href="/export">Export</a></li>
                </ul>
            </li>
            <li><a href="/about">About</a></li>
            <li>
                <CircuitCompileButton state={state} setState={setState} />
            </li>
            <li>
                <select className="select w-28">
                    <option disabled>Mainnet</option>
                    <option selected>Berkeley</option>
                    <option disabled>Local</option>
                </select>
            </li>
            <li><button className="btn">Connect</button></li>
        </ul>
)}

export default Navbar
