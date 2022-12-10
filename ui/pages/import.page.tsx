import Link from 'next/link';

import { useContext } from 'react';
import AppContext from '../components/AppContext';

async function runImport(context) {
    let element = document.getElementById('import-macpack');
    let macpack = (element.innerText || element.textContent);
    console.log(macpack);
    try {
        context.state.zkappWorkerClient.fromMacPack(macpack);
        console.log('imported correctly');
    } catch (e:any) {
        console.log('failed to import');
        console.log(e);
    }
}

const ImportCases = () => {
    const context = useContext(AppContext);
    if (context.state.loaded) {
        return (<div><p>You already have a loaded MAC! contract. Before you import another one make sure you <Link href="/close">close</Link> is first.</p></div>);
    }
    return (<div><p>The code section below is editable. Click on it and paste your MACPACK message.</p>
        <div className="rounded-md not-prose bg-primary text-primary-content">
            <div className="p-4">
                <code contentEditable="true" id="import-macpack">Paste your MACPACK here...
                </code>
            </div>
        </div>
        <p>Then hit the import button below!</p><button className="btn" onClick={async () => {
            await runImport(context);
        }}>Import</button></div>)
}


export default function _Import() {
    return (
        <div>
            <article className="container prose">
                <h1>Import Contract</h1>
                <ImportCases />
            </article>
        </div>
    )
}
