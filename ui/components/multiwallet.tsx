import { MacContextType, CastContext } from './AppContext';
import { MinaValue } from './highlights';

import {
    PublicKey,
    PrivateKey
} from 'o1js';

export const InteractionModeUIInfo = () => {
  const context: MacContextType = CastContext();
  if (context.state.usingAuro) {
    return (<p>You are using AURO wallet.</p>);
    } else {
        if (context.state.actorPublicKey) {
            return (<div>You are using <strong>PrivateKey</strong> mode as <MinaValue>{context.state.actorPublicKey.toBase58()}</MinaValue>.</div>);
        }
        return (<div>You are using <strong>PrivateKey</strong> mode but the key is not set.</div>);
    }
}

export const InteractionModeUIButton = () => {
  const context: MacContextType = CastContext();
  return (<button className="btn" onClick={async (event) => {
    await context.setState({
      ...context.state,
      usingAuro: !context.state.usingAuro
    });
  }}>Switch</button>);
}

export const InteractionModeUIForm = () => {
  const context: MacContextType = CastContext();
  return (
    <form onSubmit={
    async (event) => {
      event.preventDefault();
      const private_key = (event.target as any).base58sk.value;
      try {
        PrivateKey.fromBase58(private_key);
      } catch (e:any) {
        return alert('Invalid private key');
      }
      const actor_sk = PrivateKey.fromBase58(private_key);
      const actor_pk = actor_sk.toPublicKey();
      await context.setState({
        ...context.state,
        actorPrivateKey: actor_sk,
        actorPublicKey: actor_pk
      });
    }}>
      <div className="form-control">
        <label className="input-group">
          <InteractionModeUIButton/>
          <input
            type="password"
            name="base58sk"
            className="input input-bordered w-full max-w-xs" />
          <button
            type="submit"
            className="btn btn-active">Update Private Key</button>
        </label>
      </div>
    </form>);
}

export const InteractionModeUI = () => {
  const context: MacContextType = CastContext();
  if (context.state.usingAuro) {
    return (<div>
      <InteractionModeUIInfo/>
      <InteractionModeUIButton/>
    </div>);
    }
    return (<div>
        <InteractionModeUIInfo/>
        <InteractionModeUIForm/>
    </div>);
}
