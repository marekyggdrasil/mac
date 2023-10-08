import Link from 'next/link';

import { MacContextType, castContext } from '../components/AppContext';

async function runClose(context: MacContextType) {
  context.setState({
        ...context.state,
        loaded: false,
        finalized: false,
        macpack: 'Your MacPack will be here...'
    });
}

export default function Close() {
  const context: MacContextType = castContext();
  if (!context.state.loaded) {
    return (
      <article className="container prose">
        <h1>Close Contract</h1>
        <div><p>You do not have any loaded MAC! contract. There is nothing to close. You may <Link href="/import">import</Link> or <Link href="/create">create</Link> a new one.</p></div>
      </article>);
    }
    return (
        <article className="container prose">
            <h1>Close Contract</h1>
            <p>If you wish to close the current contract make sure you save the MACPACK somewhere as well as the private key if you are the creator.</p>
            <p>Once everything is backed up simply hit the close button below!</p><button className="btn" onClick={async () => {
                await runClose(context);
            }}>Close contract</button>
        </article>
    )
}
