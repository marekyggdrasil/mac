import Editor from '../components/editor';

export default function Create( {state, setState } ) {
    return (
        <div className="container p-5 mt-10 ml-10">
            <h1>Create a new MAC contract</h1>
            <p>this is where we create a new contract</p>
            <ul className="steps">
                <li className="step step-primary">Define</li>
                <li className="step">Deploy</li>
                <li className="step">Share!</li>
                <li className="step">Interact!</li>
            </ul>
            <Editor state={state} setState={setState} />
        </div>
    )
}
