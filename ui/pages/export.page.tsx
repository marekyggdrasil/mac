import Link from "next/link";

import ZkappWorkerClient from "./zkAppWorkerClient";

import {
  MacContextType,
  CastContext,
  castZkAppWorkerClient,
} from "../components/AppContext";

import { finalizeContract } from "../components/interaction";

const MacPackContent = () => {
  const context: MacContextType = CastContext();
  return <code className="">{context.state.macpack}</code>;
};

async function runExport(context: MacContextType) {
  try {
    if (!context.state.finalized) {
      await finalizeContract(context);
    }
    const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
    const macpack = await zkappWorkerClient.toMacPack();
    console.log("exported correctly");
    context.setState({
      ...context.state,
      loaded: true,
      finalized: true,
      macpack: macpack,
    });
  } catch (e: any) {
    console.log("failed to export");
    console.log(e);
  }
}

const FinalizeButton = () => {
  const context: MacContextType = CastContext();
  if (context.compilationButtonState == 3) {
    return <button className="btn btn-disabled">Finalize</button>;
  } else {
    return (
      <button
        className="btn btn-disabled"
        onClick={async () => {
          await runExport(context);
        }}
      >
        Finalize
      </button>
    );
  }
};

const ExportCases = () => {
  const context: MacContextType = CastContext();
  if (context.compilationButtonState < 2) {
    return (
      <div>
        <p>You need to load the SnarkyJS library first!</p>
      </div>
    );
  }
  if (!context.state.loaded) {
    return (
      <div>
        <p>
          You do not have a loaded MAC! contract. There is nothing to export.
          You may either <Link href="/create">create</Link> a new contract or{" "}
          <Link href="/import">import</Link> one.
        </p>
      </div>
    );
  }
  if (!context.state.finalized) {
    return (
      <div>
        <p>
          You have a loaded MAC! contract but it is not finalized. You may{" "}
          <FinalizeButton /> it.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p>
        Here below you will find the MacPack corresponding to your zkApp. Youmay
        share it with remaining participants allowing them to participate.
      </p>
      <div className="rounded-md not-prose bg-primary text-primary-content">
        <div className="p-4">
          <MacPackContent />
        </div>
      </div>
      <p>
        Send the above MacPack to the remaining parties of your zkApp and
        instruct them to import it in order to participate!
      </p>
    </div>
  );
};

export default function _Export() {
  return (
    <div>
      <article className="container prose">
        <h1>Export</h1>
        <ExportCases />
      </article>
    </div>
  );
}
