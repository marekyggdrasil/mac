import { useContext } from 'react';
import AppContext from './AppContext';
import { MinaValue, MinaBlockchainLength } from './highlights';

function minaValue(v) {
    let text = '';
    let va = v/1000000000;
    if (v >= 0) {
        return '+' + va.toString() + ' MINA';
    }
    return va.toString() + ' MINA';
}

function outcomeDescription(v) {
    if (v == '') {
        return 'N/A';
    }
    return v;
}

export const RenderOutcomes = () => {
    const context = useContext(AppContext);
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
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_deposit_after}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_deposit_before}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_deposit_employer)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_deposit_contractor)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_deposit_arbiter)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_deposit_employer
                                + context.state.contract_outcome_deposit_contractor
                                + context.state.contract_outcome_deposit_arbiter)}
                        </td>
                    </tr>
                    <tr>
                        <th>Success</th>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_success_after}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_success_before}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_success_employer)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_success_contractor)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_success_arbiter)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_success_employer
                                + context.state.contract_outcome_success_contractor
                                + context.state.contract_outcome_success_arbiter)}
                        </td>
                    </tr>
                    <tr>
                        <th>Failure</th>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_failure_after}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_failure_before}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_failure_employer)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_failure_contractor)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_failure_arbiter)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_failure_employer
                                + context.state.contract_outcome_failure_contractor
                                + context.state.contract_outcome_failure_arbiter)}
                        </td>
                    </tr>
                    <tr>
                        <th>Cancel</th>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_cancel_after}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            <MinaBlockchainLength>
                                {context.state.contract_outcome_cancel_before}
                            </MinaBlockchainLength>
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_cancel_employer)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_cancel_contractor)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_cancel_arbiter)}
                        </td>
                        <td>
                            {minaValue(
                                context.state.contract_outcome_cancel_employer
                                + context.state.contract_outcome_cancel_contractor
                                + context.state.contract_outcome_cancel_arbiter)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>);
}

export const RenderOutcomesDescriptions = () => {
    const context = useContext(AppContext);
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
                        <td><i>{outcomeDescription(context.state.contract_outcome_deposit_description)}</i></td>
                    </tr>
                    <tr>
                        <th>Success</th>
                        <td><i>{outcomeDescription(context.state.contract_outcome_success_description)}</i></td>
                    </tr>
                    <tr>
                        <th>Failure</th>
                        <td><i>{outcomeDescription(context.state.contract_outcome_failure_description)}</i></td>
                    </tr>
                    <tr>
                        <th>Cancel</th>
                        <td><i>{outcomeDescription(context.state.contract_outcome_cancel_description)}</i></td>
                    </tr>
                </tbody>
            </table>
        </div>);
}

function safeAddressRender(address) {
    if (!address) {
        return "";
    }
    if (address.toBase58) {
        return address.toBase58();
    }
    return "";
}

export const RenderInvolvedParties = () => {
    const context = useContext(AppContext);
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
                                { safeAddressRender(context.state.contract_employer) }
                            </MinaValue>
                        </td>
                    </tr>
                    <tr>
                        <th>Contractor</th>
                        <td>
                            <MinaValue>
                                { safeAddressRender(context.state.contract_contractor) }
                            </MinaValue>
                        </td>
                    </tr>
                    <tr>
                        <th>Arbiter</th>
                        <td>
                            <MinaValue>
                                { safeAddressRender(context.state.contract_arbiter) }
                            </MinaValue>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>);
}

export const RenderContractDescription = () => {
    const context = useContext(AppContext);
    return (
        <div>
            <h2>Contract description</h2>
            <h3>Involved parties</h3>
            <RenderInvolvedParties/>
            <h3>Outcomes</h3>
            <RenderOutcomes/>
            <h3>Contract subject description</h3>
            <blockquote className="text-xl italic font-semibold">
                <p>{context.state.contract_description}</p>
            </blockquote>
            <h3>Outcomes descriptions</h3>
            <RenderOutcomesDescriptions />
        </div>);
}
