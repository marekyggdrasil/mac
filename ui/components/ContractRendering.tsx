import React from "react";

import Countdown from "react-countdown";

import { PublicKey } from "o1js";

import {
  MacContextType,
  CastContext,
  computeBlockchainLengthDate,
  formatDateWithoutSeconds,
} from "./AppContext";

import {
  MinaValue,
  MinaBlockchainLength,
  MinaBlockTimeEstimate,
} from "./highlights";

// TODO need to define it everywhere where custom components with arguments are
// don't yet know how to avoid it...
export type GenericComponentProps<T extends React.ElementType> =
  React.ComponentProps<T> & {};

function minaValue(v: number) {
  let text = "";
  let va = v / 1000000000;
  if (v >= 0) {
    return "+" + va.toString() + " MINA";
  }
  return va.toString() + " MINA";
}

function outcomeDescription(v: string) {
  if (v == "") {
    return "N/A";
  }
  return v;
}

export const DeadlineUnitSwitchComponent = () => {
  const context: MacContextType = CastContext();
  return (
    <label className="flex cursor-pointer gap-2">
      Time-estimates
      <input
        type="checkbox"
        className="toggle"
        checked={context.state.unit_blockchain_length}
        onChange={(event: React.SyntheticEvent) => {
          const is_checked = (event.target as any).checked;
          context.setState({
            ...context.state,
            unit_blockchain_length: is_checked,
          });
        }}
      />
      Blockchain lengths
    </label>
  );
};

export const DeadlineInFormat: React.FC<GenericComponentProps<any>> = (
  props,
) => {
  const context: MacContextType = CastContext();
  if (context.state.unit_blockchain_length) {
    return <MinaBlockchainLength>{props.deadline}</MinaBlockchainLength>;
  } else {
    return (
      <MinaBlockTimeEstimate>
        {formatDateWithoutSeconds(
          computeBlockchainLengthDate(context, props.deadline),
        )}
      </MinaBlockTimeEstimate>
    );
  }
};

export const CountdownInFormat: React.FC<GenericComponentProps<any>> = (
  props,
) => {
  const context: MacContextType = CastContext();
  if (context.state.unit_blockchain_length) {
    return (
      <MinaBlockchainLength>
        {props.deadline - context.blockchainLength}
      </MinaBlockchainLength>
    );
  } else {
    return (
      <MinaBlockTimeEstimate>
        <Countdown
          date={computeBlockchainLengthDate(context, props.deadline)}
        />
      </MinaBlockTimeEstimate>
    );
  }
};

export const RenderOutcomes = () => {
  const context: MacContextType = CastContext();
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>After</th>
            <th>Before</th>
            <th>Employer</th>
            <th>Contractor</th>
            <th>Arbiter</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Deposit</th>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_deposit_after}
              />
            </td>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_deposit_before}
              />
            </td>
            <td>
              {minaValue(context.state.contract_outcome_deposit_employer)}
            </td>
            <td>
              {minaValue(context.state.contract_outcome_deposit_contractor)}
            </td>
            <td>{minaValue(context.state.contract_outcome_deposit_arbiter)}</td>
            <td>
              {minaValue(
                context.state.contract_outcome_deposit_employer +
                  context.state.contract_outcome_deposit_contractor +
                  context.state.contract_outcome_deposit_arbiter,
              )}
            </td>
          </tr>
          <tr>
            <th>Success</th>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_success_after}
              />
            </td>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_success_before}
              />
            </td>
            <td>
              {minaValue(context.state.contract_outcome_success_employer)}
            </td>
            <td>
              {minaValue(context.state.contract_outcome_success_contractor)}
            </td>
            <td>{minaValue(context.state.contract_outcome_success_arbiter)}</td>
            <td>
              {minaValue(
                context.state.contract_outcome_success_employer +
                  context.state.contract_outcome_success_contractor +
                  context.state.contract_outcome_success_arbiter,
              )}
            </td>
          </tr>
          <tr>
            <th>Failure</th>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_failure_after}
              />
            </td>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_failure_before}
              />
            </td>
            <td>
              {minaValue(context.state.contract_outcome_failure_employer)}
            </td>
            <td>
              {minaValue(context.state.contract_outcome_failure_contractor)}
            </td>
            <td>{minaValue(context.state.contract_outcome_failure_arbiter)}</td>
            <td>
              {minaValue(
                context.state.contract_outcome_failure_employer +
                  context.state.contract_outcome_failure_contractor +
                  context.state.contract_outcome_failure_arbiter,
              )}
            </td>
          </tr>
          <tr>
            <th>Cancel</th>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_cancel_after}
              />
            </td>
            <td>
              <DeadlineInFormat
                deadline={context.state.contract_outcome_cancel_before}
              />
            </td>
            <td>{minaValue(context.state.contract_outcome_cancel_employer)}</td>
            <td>
              {minaValue(context.state.contract_outcome_cancel_contractor)}
            </td>
            <td>{minaValue(context.state.contract_outcome_cancel_arbiter)}</td>
            <td>
              {minaValue(
                context.state.contract_outcome_cancel_employer +
                  context.state.contract_outcome_cancel_contractor +
                  context.state.contract_outcome_cancel_arbiter,
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const RenderOutcomesDescriptions = () => {
  const context: MacContextType = CastContext();
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Deposit</th>
            <td>
              <i>
                {outcomeDescription(
                  context.state.contract_outcome_deposit_description,
                )}
              </i>
            </td>
          </tr>
          <tr>
            <th>Success</th>
            <td>
              <i>
                {outcomeDescription(
                  context.state.contract_outcome_success_description,
                )}
              </i>
            </td>
          </tr>
          <tr>
            <th>Failure</th>
            <td>
              <i>
                {outcomeDescription(
                  context.state.contract_outcome_failure_description,
                )}
              </i>
            </td>
          </tr>
          <tr>
            <th>Cancel</th>
            <td>
              <i>
                {outcomeDescription(
                  context.state.contract_outcome_cancel_description,
                )}
              </i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

function safeAddressRender(address: PublicKey) {
  if (!address) {
    return "";
  }
  if (address.toBase58) {
    return address.toBase58();
  }
  return "";
}

export const RenderInvolvedParties = () => {
  const context: MacContextType = CastContext();
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Party</th>
            <th>MINA Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Employer</th>
            <td>
              <MinaValue>
                {safeAddressRender(context.state.contract_employer)}
              </MinaValue>
            </td>
          </tr>
          <tr>
            <th>Contractor</th>
            <td>
              <MinaValue>
                {safeAddressRender(context.state.contract_contractor)}
              </MinaValue>
            </td>
          </tr>
          <tr>
            <th>Arbiter</th>
            <td>
              <MinaValue>
                {safeAddressRender(context.state.contract_arbiter)}
              </MinaValue>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const RenderContractDescription = () => {
  const context: MacContextType = CastContext();
  return (
    <div>
      <h2>Contract description</h2>
      <h3>Involved parties</h3>
      <RenderInvolvedParties />
      <h3>Outcomes</h3>
      <DeadlineUnitSwitchComponent />
      <RenderOutcomes />
      <h3>Contract subject description</h3>
      <blockquote className="text-xl italic font-semibold">
        <p>{context.state.contract_description}</p>
      </blockquote>
      <h3>Outcomes descriptions</h3>
      <RenderOutcomesDescriptions />
    </div>
  );
};
