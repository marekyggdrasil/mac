import Link from 'next/link';
import Editor from '../components/editor';

import { MacContextType, CastContext } from '../components/AppContext';
import { MinaValue } from '../components/highlights';

const CreationSteps = () => {
  const context: MacContextType = CastContext();
  return (
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
  const context: MacContextType = CastContext();
  if (context.connectionButtonState < 2) {
    return <article className="container prose">
      Auro wallet not connected.
    </article>;
    }
    return <article className="container prose">
        Connected as <MinaValue>{ context.connectedAddress }</MinaValue>.
    </article>;
}

const CreateCases = () => {
  const context: MacContextType = CastContext();
  if (context.compilationButtonState < 2) {
    return (
      <article className="container prose">
        <h1>Create a new MAC contract</h1>
        <div><p>You need to load the o1js library first!</p></div>
      </article>);
    }
    if (context.state.loaded) {
        return (
            <article className="container prose">
                <h1>Create a new MAC contract</h1>
                <div><p>You already have a loaded MAC! contract. You may <Link href="/current">deploy it or interact with it</Link>, <Link href="/close">close it</Link> or <Link href="/export">export it</Link>.</p></div>
            </article>);
    }
    if (context.connectionButtonState < 2) {
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

export default function Create() {
  const context: MacContextType = CastContext();
  return <CreateCases />;
}
