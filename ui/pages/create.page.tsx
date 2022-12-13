import Link from 'next/link';
import Editor from '../components/editor';

import { useContext } from 'react';
import AppContext from '../components/AppContext';

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

export default function Create( {state, setState } ) {
    const context = useContext(AppContext);
    if (context.state.comp_button_state < 2) {
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
                <div><p>You already have a loaded MAC! contract. Before you import another one make sure you <Link href="/close">close</Link> is first.</p></div>
            </article>);
    }
    return (
       <article className="container gap-8 columns-2 prose">
           <h1>Create a new MAC contract</h1>
           <CreationSteps />
           <Editor />
       </article>);
    }
