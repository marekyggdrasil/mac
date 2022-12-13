import Link from 'next/link';

import { useContext } from 'react';
import AppContext from '../components/AppContext';



const MacPackContent = () => {
    const context = useContext(AppContext);
    return (<code className="">{ context.state.macpack }</code>)
}


async function runExport(context) {
    let element = document.getElementById('import-macpack');
    let macpack = (element.innerText || element.textContent);
    console.log(macpack);
    try {
        const macpack = await context.state.zkappWorkerClient.toMacPack();
        console.log('imported correctly');
        context.setState({ ...context.state, loaded: true, macpack: macpack });
    } catch (e:any) {
        console.log('failed to import');
        console.log(e);
    }
}


const ExportCases = () => {
    const context = useContext(AppContext);
    if (context.state.comp_button_state < 2) {
        return (<div><p>You need to load the SnarkyJS library first!</p></div>);
    }
    if (!context.state.loaded) {
        return (
            <div>
                <p>You do not have a loaded MAC! contract. There is nothing to export. You may either <Link href="/create">create</Link> a new contract or <Link href="/import">import</Link> one.</p>
            </div>);
    }
    return (
        <div>
            <p>Here below you will find the MacPack corresponding to your zkApp. Youmay share it with remaining participants allowing them to participate.</p>
            <div className="rounded-md not-prose bg-primary text-primary-content">
                <div className="p-4">
                    <MacPackContent />
                </div>
            </div>
            <p>Send the above MacPack to the remaining parties of your zkApp and instruct them to import it in order to participate!</p>
        </div>);
}


export default function _Export() {
    return (
        <div>
            <article className="container prose">
                <h1>Export</h1>
                <ExportCases />
            </article>
        </div>
    )
}
