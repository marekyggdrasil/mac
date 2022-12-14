import Link from 'next/link';
import Editor from '../components/editor';

import { useContext } from 'react';

import AppContext from '../components/AppContext';
import { MinaValue } from '../components/highlights';

const CreationSteps = () => {
    const context = useContext(AppContext);
    if (
        <div><p>this is where we create a new contract</p>
            <ul className="steps">
                <li className="step step-primary">Define</li>
                <li className="step">Deploy</li>
                <li className="step">Share!</li>
                <li className="step">Interact!</li>
            </ul>
        </div>);
}

const ConnectionIndicator = () => {
    const context = useContext(AppContext);
    if (context.state.connect_button_state < 2) {
        return <article className="container prose">
            Auro wallet not connected.
        </article>;
    }
    return <article className="container prose">
        Connected as <MinaValue>{ context.state.publicKey.toBase58() }</MinaValue>.
    </article>;
}

const CreateCases = () => {
    const context = useContext(AppContext);if (context.state.comp_button_state < 2) {
        return (
            <article className="container prose">
                <h1>Create a new MAC contract</h1>
                <div><p>You need to load the SnarkyJS library first!</p></div>
            </article>);
    }
    if (context.state.loaded) {
        return (
            <article className="container prose">
                <h1>Create a new MAC contract</h1>
                <div><p>You already have a loaded MAC! contract. You may <Link href="/current">deploy it or interact with it</Link>, <Link href="/close">close it</Link> or <Link href="/export">export it</Link>.</p></div>
            </article>);
    }
    if (context.state.connect_button_state < 2) {
        return (
            <article className="container prose">
                <h1>Create a new MAC contract</h1>
                <div><p>Make sure you connect your AuroWallet!</p></div>
            </article>);
    }
    return (
        <article className="container gap-8 prose">
            <h1>Create a new MAC contract</h1>
            <CreationSteps />
            <Editor />
        </article>);
}

export default function Create( {state, setState } ) {
    const context = useContext(AppContext);
    return <CreateCases />;
}
