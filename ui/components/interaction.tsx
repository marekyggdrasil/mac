import Link from "next/link";

import {
  toastInfo,
  toastWarning,
  toastError,
  toastSuccess,
} from "../components/toast";
import ZkappWorkerClient from "../pages/zkAppWorkerClient";

import {
  MacContextType,
  CastContext,
  castZkAppWorkerClient,
  getTransactionBlockExplorerURL,
  getNetworkFromName,
  ContractStateActedType,
  ContractStateType,
} from "./AppContext";

import { MinaValue } from "./highlights";

import {
  contractDeploy,
  contractDeposit,
  contractWithdraw,
  contractCancel,
  contractSuccess,
  contractFailure,
} from "./txBuilding";

import {
  DeadlineUnitSwitchComponent,
  DeadlineInFormat,
  CountdownInFormat,
  RenderContractDescription,
} from "./ContractRendering";

import { PublicKey } from "o1js";

export async function finalizeContract(context: MacContextType) {
  // instantiate preimage via worker and compute macpack
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);
  if (context.state.contract_nonce === null) {
    toastError("random nonce is not set");
    throw Error("random nonce is not set");
  }
  await zkappWorkerClient.definePreimage(
    context.state.contract_nonce.toString(),
    context.state.zkappPublicKey.toBase58(),
    context.state.contract_employer.toBase58(),
    context.state.contract_contractor.toBase58(),
    context.state.contract_arbiter.toBase58(),
    context.state.contract_description,
    context.state.contract_outcome_deposit_description,
    Math.abs(context.state.contract_outcome_deposit_after),
    Math.abs(context.state.contract_outcome_deposit_before),
    Math.abs(context.state.contract_outcome_deposit_employer),
    Math.abs(context.state.contract_outcome_deposit_contractor),
    Math.abs(context.state.contract_outcome_deposit_arbiter),
    context.state.contract_outcome_success_description,
    Math.abs(context.state.contract_outcome_success_after),
    Math.abs(context.state.contract_outcome_success_before),
    Math.abs(context.state.contract_outcome_success_employer),
    Math.abs(context.state.contract_outcome_success_contractor),
    Math.abs(context.state.contract_outcome_success_arbiter),
    context.state.contract_outcome_failure_description,
    Math.abs(context.state.contract_outcome_failure_after),
    Math.abs(context.state.contract_outcome_failure_before),
    Math.abs(context.state.contract_outcome_failure_employer),
    Math.abs(context.state.contract_outcome_failure_contractor),
    Math.abs(context.state.contract_outcome_failure_arbiter),
    context.state.contract_outcome_cancel_description,
    Math.abs(context.state.contract_outcome_cancel_after),
    Math.abs(context.state.contract_outcome_cancel_before),
    Math.abs(context.state.contract_outcome_cancel_employer),
    Math.abs(context.state.contract_outcome_cancel_contractor),
    Math.abs(context.state.contract_outcome_cancel_arbiter),
    Math.abs(context.state.contract_outcome_unresolved_after),
    Math.abs(context.state.contract_outcome_unresolved_employer),
    Math.abs(context.state.contract_outcome_unresolved_contractor),
    Math.abs(context.state.contract_outcome_unresolved_arbiter),
  );
  // now get its macpack
  const macpack = await zkappWorkerClient.toMacPack();
  context.setState({ ...context.state, loaded: true, macpack: macpack });
}

async function contractRefreshState(context: MacContextType) {
  const zkappWorkerClient: ZkappWorkerClient = castZkAppWorkerClient(context);

  // refresh the blockchain length
  const network_endpoint = getNetworkFromName(context.network);
  const length =
    await zkappWorkerClient.fetchBlockchainLength(network_endpoint);
  await context.setBlockchainLength(length);
  await context.setBlockFetchDate(new Date()); // TODO replace it with that block timestamp

  // refresh the contract state
  const contract_state = await zkappWorkerClient.getContractState();
  const contract_state_parsed = JSON.parse(contract_state) as ContractStateType;
  console.log(contract_state_parsed);
  context.setState({
    ...context.state,
    employerActed: contract_state_parsed.acted.employer,
    contractorActed: contract_state_parsed.acted.contractor,
    arbiterActed: contract_state_parsed.acted.arbiter,
    automatonState: contract_state_parsed.automaton_state,
  });
}

const ContractRefreshButton = () => {
  const context: MacContextType = CastContext();
  if (!context.state.loaded) {
    return (
      <div
        className="tooltip tooltip-open tooltip-bottom"
        data-tip="zkApp contract not loaded"
      >
        <button className="btn btn-disabled">Refresh</button>
      </div>
    );
  }
  return (
    <button
      className="btn btn-primary"
      onClick={async () => {
        try {
          await contractRefreshState(context);
        } catch (error) {
          throw error;
          toastError("Failed to refresh the smart contract state");
          return;
        }
        toastSuccess("Smart contract state refreshed successfully!");
      }}
    >
      Refresh
    </button>
  );
};

const DeployButton = () => {
  const context: MacContextType = CastContext();
  if (!context.state.deployed) {
    if (context.state.zkappPrivateKey === null) {
      return (
        <div
          className="tooltip tooltip-open tooltip-bottom tooltip-error"
          data-tip="zkApp private key is missing. Are you deploying macpack import?"
        >
          <button className="btn btn-disabled">Deploy</button>
        </div>
      );
    }
    if (
      context.state.tx_building_state != "" &&
      context.state.tx_command != "deploy"
    ) {
      return <button className="btn btn-disabled animate-pulse">Deploy</button>;
    }
    if (
      context.state.tx_building_state != "" &&
      context.state.tx_command == "deploy"
    ) {
      return (
        <button className="btn btn-primary btn-disabled animate-pulse">
          {context.state.tx_building_state}
        </button>
      );
    }
    return (
      <button
        className="btn btn-primary"
        onClick={async () => {
          try {
            await contractDeploy(context);
          } catch (error) {
            await context.setState({
              ...context.state,
              tx_building_state: "",
              tx_command: "deploy",
            });
          }
        }}
      >
        Deploy
      </button>
    );
  }
  return <button className="btn btn-disabled">Deploy</button>;
};

const DepositButton = () => {
  const context: MacContextType = CastContext();
  if (
    context.state.contract_outcome_deposit_after <= context.blockchainLength &&
    context.blockchainLength < context.state.contract_outcome_deposit_before
  ) {
    if (context.state.tx_building_state == "") {
      if (context.state.automatonState != "initial") {
        return <button className="btn btn-disabled">Deposit</button>;
      }
      return (
        <button
          className="btn btn-primary"
          onClick={async () => {
            await contractDeposit(context);
          }}
        >
          Deposit
        </button>
      );
    } else if (
      context.state.tx_building_state != "" &&
      context.state.tx_command != "deposit"
    ) {
      return <button className="btn btn-disabled">Deposit</button>;
    }
  }
  return <button className="btn btn-disabled">Deposit</button>;
};

const WithdrawButton = () => {
  const context: MacContextType = CastContext();
  if (
    context.connectedAddress === null ||
    context.blockchainLength < context.state.contract_outcome_deposit_after
  ) {
    return <button className="btn btn-disabled">Withdraw</button>;
  }
  if (
    context.state.automatonState != "canceled_early" &&
    context.state.automatonState != "canceled" &&
    context.state.automatonState != "succeeded" &&
    context.state.automatonState != "failed"
  ) {
    return <button className="btn btn-disabled">Withdraw</button>;
  }
  return (
    <button
      className="btn btn-primary"
      onClick={async () => {
        await contractWithdraw(context);
      }}
    >
      Withdraw
    </button>
  );
};

const SuccessButton = () => {
  const context: MacContextType = CastContext();
  if (context.connectedAddress === null) {
    return (
      <button className="btn btn-primary btn-disabled">Judge success</button>
    );
  }
  const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
  if (
    context.state.contract_outcome_success_after <= context.blockchainLength &&
    context.blockchainLength < context.state.contract_outcome_success_before &&
    actor == context.state.contract_arbiter
  ) {
    return (
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractSuccess(context);
        }}
      >
        Judge success
      </button>
    );
  }
  return <button className="btn btn-disabled">Judge success</button>;
};

const FailureButton = () => {
  const context: MacContextType = CastContext();
  if (context.connectedAddress === null) {
    return (
      <button className="btn btn-primary btn-disabled">Judge failure</button>
    );
  }
  const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
  if (
    context.state.contract_outcome_failure_after <= context.blockchainLength &&
    context.blockchainLength < context.state.contract_outcome_failure_before &&
    actor == context.state.contract_arbiter
  ) {
    return (
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractFailure(context);
        }}
      >
        Judge failure
      </button>
    );
  }
  return <button className="btn btn-disabled">Judge failure</button>;
};

const CancelButton = () => {
  const context: MacContextType = CastContext();
  if (context.connectedAddress === null) {
    return <button className="btn btn-disabled">Cancel for free</button>;
  }
  const actor: PublicKey = PublicKey.fromBase58(context.connectedAddress);
  if (
    context.state.contract_outcome_deposit_after <= context.blockchainLength &&
    context.blockchainLength < context.state.contract_outcome_deposit_before
  ) {
    return (
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractCancel(context);
        }}
      >
        Cancel for free
      </button>
    );
  } else if (
    context.state.contract_outcome_cancel_after <= context.blockchainLength &&
    context.blockchainLength < context.state.contract_outcome_cancel_before &&
    actor == context.state.contract_contractor
  ) {
    return (
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractCancel(context);
        }}
      >
        Cancel for penalty
      </button>
    );
  }
  return <button className="btn btn-disabled">Cancel for penalty</button>;
};

const GodMode = () => {
  const context: MacContextType = CastContext();
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractDeploy(context);
        }}
      >
        God Mode Deploy
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractDeposit(context);
        }}
      >
        God Mode Deposit
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractWithdraw(context);
        }}
      >
        God Mode Withdraw
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractSuccess(context);
        }}
      >
        God Mode Judge success
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractFailure(context);
        }}
      >
        God Mode Judge failure
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          await contractCancel(context);
        }}
      >
        God Mode Cancel for free
      </button>
    </div>
  );
};

const DeploymentInformation = () => {
  const context: MacContextType = CastContext();
  if (context.state.deployed) {
    return <p>The contract has been deployed.</p>;
  } else {
    return (
      <p>
        The contract is pending deployment.
        <DeployButton />
      </p>
    );
  }
};

const TxIds = () => {
  const context: MacContextType = CastContext();
  if (context.txHash != "") {
    const url = getTransactionBlockExplorerURL(context.network, context.txHash);
    console.log(url);
    return (
      <div>
        Your last transaction is{" "}
        <a href={url} target="_blank" rel="noreferrer">
          {context.txHash}
        </a>
      </div>
    );
  }
  return <div></div>;
};

const ConnectedAccount = () => {
  const context: MacContextType = CastContext();
  if (context.connectedAddress !== null) {
    const employer = context.state.contract_employer.toBase58();
    const contractor = context.state.contract_contractor.toBase58();
    const arbiter = context.state.contract_arbiter.toBase58();
    switch (context.connectedAddress) {
      case employer:
        return (
          <p>
            Interacting as <MinaValue>{context.connectedAddress}</MinaValue>.
            You take <strong>employer</strong> role in this contract.
          </p>
        );
        break;
      case contractor:
        return (
          <p>
            Interacting as <MinaValue>{context.connectedAddress}</MinaValue>.
            You take <strong>contractor</strong> role in this contract.
          </p>
        );
        break;
      case arbiter:
        return (
          <p>
            Interacting as <MinaValue>{context.connectedAddress}</MinaValue>.
            You take <strong>arbiter</strong> role in this contract.
          </p>
        );
        break;
      default:
        return (
          <p>
            Interacting as <MinaValue>{context.connectedAddress}</MinaValue>.
            You take no role in this contract.
          </p>
        );
        break;
    }
  }
  return <p>Failed to fetch your account from Auro wallet...</p>;
};

const CancelTimeLine = () => {
  const context: MacContextType = CastContext();
  if (
    context.state.contract_outcome_cancel_after <= context.blockchainLength &&
    context.blockchainLength < context.state.contract_outcome_cancel_before
  ) {
    return (
      <p>
        It is possible to <strong>cancel</strong> at the current stage with a
        financial penalty.
      </p>
    );
  } else if (
    context.blockchainLength < context.state.contract_outcome_cancel_before
  ) {
    return (
      <p>
        The option to <strong>cancel</strong> with a financial penalty has not
        opened yet.
      </p>
    );
  }
  return (
    <p>
      The option to <strong>cancel</strong> with a financial penalty has already
      closed.
    </p>
  );
};

/*
   DeadlineUnitSwitchComponent
   <DeadlineUnitSwitchComponent />
   <DeadlineInFormat
   deadline={context.state.contract_outcome_failure_after}
   />
   <CountdownInFormat
   deadline={context.state.contract_outcome_failure_after}
   />
 */

const ContractTimeline = () => {
  const context: MacContextType = CastContext();
  if (context.blockchainLength !== null) {
    if (
      context.blockchainLength < context.state.contract_outcome_deposit_after
    ) {
      return (
        <div>
          <DeadlineUnitSwitchComponent />
          <p>
            The contract is in the <strong>warm-up</strong> stage. Next stage is{" "}
            <strong>deposit</strong> stage and will occurr in{" "}
            <CountdownInFormat
              deadline={context.state.contract_outcome_deposit_after}
            />
            .
          </p>
        </div>
      );
    } else if (
      context.state.contract_outcome_deposit_after <=
        context.blockchainLength &&
      context.blockchainLength < context.state.contract_outcome_deposit_before
    ) {
      if (context.state.automatonState == "deposited") {
        return (
          <div>
            <DeadlineUnitSwitchComponent />
            <p>
              Everyone made their deposit but the contract is is still in the{" "}
              <strong>deposit</strong> stage. It is possible to{" "}
              <strong>cancel</strong> for free with no consequences. The current
              stage will end in{" "}
              <CountdownInFormat
                deadline={context.state.contract_outcome_deposit_before}
              />
              .
            </p>
          </div>
        );
      }
      return (
        <div>
          <DeadlineUnitSwitchComponent />
          <p>
            The contract is in the <strong>deposit</strong> stage. It is
            possible to <strong>cancel</strong> for free with no consequences.
            The current stage will end in{" "}
            <CountdownInFormat
              deadline={context.state.contract_outcome_deposit_before}
            />
            .
          </p>
        </div>
      );
    } else if (
      context.state.contract_outcome_success_after <=
        context.blockchainLength &&
      context.blockchainLength < context.state.contract_outcome_success_before
    ) {
      if (context.state.automatonState == "succeeded") {
        return (
          <div>
            <DeadlineUnitSwitchComponent />
            <p>
              The contract was judged <strong>success</strong> but it is still
              in the <strong>success declaration</strong> stage. The current
              stage will end in{" "}
              <CountdownInFormat
                deadline={context.state.contract_outcome_success_before}
              />
              .
            </p>
            <CancelTimeLine />
          </div>
        );
      }
      return (
        <div>
          <DeadlineUnitSwitchComponent />
          <p>
            The contract is in the <strong>success declaration</strong> stage.
            The current stage will end in{" "}
            <CountdownInFormat
              deadline={context.state.contract_outcome_success_before}
            />
            .
          </p>
          <CancelTimeLine />
        </div>
      );
    } else if (
      context.state.contract_outcome_failure_after <=
        context.blockchainLength &&
      context.blockchainLength < context.state.contract_outcome_failure_before
    ) {
      if (context.state.automatonState == "succeeded") {
        return (
          <div>
            <DeadlineUnitSwitchComponent />
            <p>
              The contract was judged <strong>success</strong> but it is still
              in the <strong>failure declaration</strong> stage. The current
              stage will end in{" "}
              <CountdownInFormat
                deadline={context.state.contract_outcome_failure_before}
              />
              .
            </p>
            <CancelTimeLine />
          </div>
        );
      } else if (context.state.automatonState == "failed") {
        return (
          <div>
            <DeadlineUnitSwitchComponent />
            <p>
              The contract was judged <strong>failed</strong> but it is still in
              the <strong>failure declaration</strong> stage. The current stage
              will end in{" "}
              <CountdownInFormat
                deadline={context.state.contract_outcome_failure_before}
              />
              .
            </p>
            <CancelTimeLine />
          </div>
        );
      }
      return (
        <div>
          <DeadlineUnitSwitchComponent />
          <p>
            The contract is in the <strong>failure declaration</strong> stage.
            The current stage will end in{" "}
            <CountdownInFormat
              deadline={context.state.contract_outcome_failure_before}
            />
            .
          </p>
          <CancelTimeLine />
        </div>
      );
    } else {
      return (
        <div>
          <DeadlineUnitSwitchComponent />
          <p>
            All the contract stages have expired. It is possible to withdraw
            according to <strong>unresolved</strong> outcome specification.
          </p>
          <CancelTimeLine />
        </div>
      );
    }
  }
  return (
    <p>
      Failed to fetch current blockchain length... It is not possible to
      establish in which stage current contract is.
    </p>
  );
};

const EmployerActed = () => {
  const context: MacContextType = CastContext();
  if (context.state.employerActed) {
    return <div>Employer has acted.</div>;
  }
  return <div></div>;
};

const ContractorActed = () => {
  const context: MacContextType = CastContext();
  if (context.state.contractorActed) {
    return <div>Contractor has acted.</div>;
  }
  return <div></div>;
};

const ArbiterActed = () => {
  const context: MacContextType = CastContext();
  if (context.state.arbiterActed) {
    return <div>Arbiter has acted.</div>;
  }
  return <div></div>;
};

const WhoActed = () => {
  return (
    <div>
      <EmployerActed />
      <ContractorActed />
      <ArbiterActed />
    </div>
  );
};

const InteractionUI = () => {
  const context: MacContextType = CastContext();
  return (
    <div>
      <ConnectedAccount />
      <ContractTimeline />
      <WhoActed />
      <TxIds />
      <ContractRefreshButton />
      <DeployButton />
      <DepositButton />
      <WithdrawButton />
      <SuccessButton />
      <FailureButton />
      <CancelButton />
    </div>
  );
};

const InteractionEditor = () => {
  const context: MacContextType = CastContext();
  if (!context.state.deployed) {
    if (context.compilationButtonState < 4) {
      return (
        <div>
          Your contract is finalized and is is already possible to{" "}
          <Link href="/export">export</Link> it using MacPacks. However, it is
          not available on-chain. Make sure you compile the zk-SNARK circuit
          first and then you may deploy it. Compilation will take between 7 and
          20 minutes so make sure you have some nice show to watch in the
          meantime.
        </div>
      );
    } else {
      return (
        <div>
          <h2>Interaction</h2>
          <DeploymentInformation />
        </div>
      );
    }
  }
  return (
    <div>
      <h2>Interaction</h2>
      <DeploymentInformation />
      <InteractionUI />
    </div>
  );
};

const InteractionCases = () => {
  const context: MacContextType = CastContext();
  if (context.compilationButtonState < 2) {
    return <div>Make sure you load the o1js library!</div>;
  } else if (context.connectionButtonState < 2) {
    return <div>Make sure you connect your AuroWallet!</div>;
  } else if (!context.state.loaded) {
    return (
      <div>
        Now you may <Link href="/create">create a new contract</Link> or{" "}
        <Link href="/import">import an existing contract</Link>.
      </div>
    );
  } else {
    return (
      <div>
        <InteractionEditor />
        <RenderContractDescription />
      </div>
    );
  }
};

const Interaction = () => {
  return (
    <article className="container prose">
      <h1>
        Interact with a <i>MAC!</i> contract
      </h1>
      <InteractionCases />
    </article>
  );
};

export default Interaction;
