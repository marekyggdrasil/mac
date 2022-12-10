import { useContext } from 'react';
import AppContext from './AppContext';


const InteractionCases = () => {
    const context = useContext(AppContext);
    console.log('editor');
    console.log(context.state);
    console.log(context.setState);
    if (context.state.comp_button_state < 2) {
        return (<div>Make sure you load the SnarkyJS library!</div>);
    } else if (context.state.connect_button_state < 2) {
        return (<div>Make sure you connect your AuroWallet!</div>);
    } else {
        console.log('context public key');
        console.log(context.state.publicKey);
        // {context.state.publicKey.toBase58()}
        return (<div>Interacting as <code className="rounded-md bg-primary p-1">{context.state.publicKey.toBase58()}</code>. If you wish to use different account, open your AURO wallet and simply switch the account. Simple as that!</div>);
    }
}



const Interaction = () => {
    return (
        <article className="container prose">
            <h1>Interact with a MAC contract</h1>
            <InteractionCases />
        </article>);
}

/*
else if (context.state.comp_button_state < 4) {
   return (
   <div>Make sure you compile the ZK Circuit first!</div>
   );
   }
 */

export default Interaction;