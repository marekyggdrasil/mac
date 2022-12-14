import { useContext } from 'react';

import {
    PublicKey,
    PrivateKey
} from 'snarkyjs';

import AppContext from './AppContext';
import { MinaValue, MinaBlockchainLength, MinaSecretValue } from './highlights';

async function generateKeyPair(context) {
    const sk: PrivateKey = await context.state.zkappWorkerClient.generatePrivateKey();
    const pk: PublicKey = sk.toPublicKey();
    context.setState({ ...context.state, zkappPrivateKey: sk, zkappPublicKey: pk });
}

const KeyGenerator = () => {
    const context = useContext(AppContext);
    if (!context.state.zkappPrivateKey) {
        return <p>Your MAC! contract does not have a private key. Click on <button className="btn" onClick={async (event) => {
            event.preventDefault();
            await generateKeyPair(context);
            return;
        }}>Generate</button> to prepare a new key pair.</p>;
    }
    return <p>Your MAC! contract public key and address is <MinaValue>{ context.state.zkappPublicKey.toBase58() }</MinaValue> and corresponding private key is <MinaSecretValue>{ context.state.zkappPrivateKey.toBase58() }</MinaSecretValue></p>;
}

const Editor = () => {
    const context = useContext(AppContext);
    return (
        <form onSubmit={async (event) => {
            event.preventDefault();
            console.log(event);
            const max_string_length = 128;
            const t = 1 // 2520 is a week, time unit
            const m = 1000000000 // mina denomination

            // key generation
            if (!context.state.zkappPrivateKey) {
                return alert('Smart contract key pair not generated');
            }
            // addresses
            const contractor = event.target[0].value;
            try {
                PublicKey.fromBase58(contractor);
            } catch (e:any) {
                return alert('Invalid contractor address');
            }

            const arbiter = event.target[1].value;
            try {
                PublicKey.fromBase58(arbiter);
            } catch (e:any) {
                return alert('Invalid arbiter address');
            }

            const contract_subject = event.target[2].value;

            // contractor
            const contractor_payment = parseFloat(event.target[3].value);
            const contractor_deposit = parseFloat(event.target[4].value);
            const contracor_penalty_failure_percent = event.target[5].value;
            const contracor_penalty_cancel_percent = event.target[6].value;

            // employer
            const employer_deposit = parseFloat(event.target[7].value);
            const employer_arbitration_fee_percent = event.target[8].value;

            // arbiter
            const arbiter_payment = parseFloat(event.target[9].value);
            const arbiter_deposit = parseFloat(event.target[10].value);
            const arbiter_penalty_non_acting_percent = event.target[11].value;

            // deadlines
            const deadline_warmup = event.target[12].value;
            const deadline_deposit = event.target[13].value;
            const deadline_execution = event.target[14].value;
            const deadline_failure = event.target[15].value;

            // descriptions
            const subject_deposit = event.target[16].value;
            const subject_success = event.target[17].value;
            const subject_failure = event.target[18].value;
            const subject_cancel = event.target[19].value;

            // compute the values
            const l = context.state.blockchainLenght;
            const a = Math.round(deadline_warmup*t);
            const b = Math.round(deadline_deposit*t);
            const c = Math.round(deadline_execution*t);
            const d = Math.round(deadline_failure*t);

            // set the deadline values
            const contract_outcome_deposit_after = l + a;
            const contract_outcome_deposit_before = l + a + b;
            const contract_outcome_success_after = l + a + b;
            const contract_outcome_success_before = l + a + b + c;
            const contract_outcome_failure_after = l + a + b + c;
            const contract_outcome_failure_before = l + a + b + c + d;
            const contract_outcome_cancel_after = l + a + b;
            const contract_outcome_cancel_before = l + a + b + c;

            // set the descriptions
            const contract_description = contract_subject;
            const contract_outcome_deposit_description = subject_deposit;
            const contract_outcome_success_description = subject_success;
            const contract_outcome_failure_description = subject_failure;
            const contract_outcome_cancel_description = subject_cancel;

            // compute the amounts
            console.log('helper values');
            const emp_arb = Math.round(
                (employer_arbitration_fee_percent/100)*arbiter_payment);

            const con_arb = arbiter_payment-emp_arb;
            const con_fail = Math.round(
                (contracor_penalty_failure_percent/100)*arbiter_payment);
            const con_cancel = Math.round(
                (contracor_penalty_cancel_percent/100)*arbiter_payment);

            console.log(emp_arb);
            console.log(con_arb);
            console.log(con_fail);
            console.log(con_cancel);

            console.log('outcomes amounts')
            const contract_outcome_deposit_employer = Math.round((
                contractor_payment
                + employer_deposit
                + emp_arb)*m);
            const contract_outcome_deposit_contractor = Math.round((
                contractor_deposit + con_arb)*m);
            const contract_outcome_deposit_arbiter = Math.round((
                arbiter_deposit)*m);

            const contract_outcome_success_employer = Math.round((
                employer_deposit)*m);
            const contract_outcome_success_contractor = Math.round((
                contractor_payment + contractor_deposit)*m);
            const contract_outcome_success_arbiter = Math.round((
                arbiter_payment)*m);

            const contract_outcome_failure_employer = Math.round((
                contractor_payment + employer_deposit + con_fail)*m);
            const contract_outcome_failure_contractor = Math.round((
                contractor_deposit - con_fail)*m);
            const contract_outcome_failure_arbiter = Math.round((
                arbiter_payment)*m);

            const contract_outcome_cancel_employer = Math.round((
                contractor_payment + employer_deposit + con_cancel)*m);
            const contract_outcome_cancel_contractor = Math.round((
                contractor_deposit - con_cancel)*m);
            const contract_outcome_cancel_arbiter = Math.round((
                arbiter_payment)*m);

            console.log(contract_outcome_deposit_employer);
            console.log(contract_outcome_deposit_contractor);
            console.log(contract_outcome_deposit_arbiter);
            console.log(contract_outcome_success_employer);
            console.log(contract_outcome_success_contractor);
            console.log(contract_outcome_success_arbiter);
            console.log(contract_outcome_failure_employer);
            console.log(contract_outcome_failure_contractor);
            console.log(contract_outcome_failure_arbiter);
            console.log(contract_outcome_cancel_employer);
            console.log(contract_outcome_cancel_contractor);
            console.log(contract_outcome_cancel_arbiter);

            // set the participants
            const contract_contractor = PublicKey.fromBase58(contractor);
            const contract_arbiter = PublicKey.fromBase58(arbiter);

            // set the state
            context.setState({
                ...context.state,
                loaded: true,
                contract_employer: context.state.publicKey,
                contract_contractor: contract_contractor,
                contract_arbiter: contract_arbiter,
                contract_outcome_deposit_after: contract_outcome_deposit_after,
                contract_outcome_deposit_before: contract_outcome_deposit_before,
                contract_outcome_success_after: contract_outcome_success_after,
                contract_outcome_success_before: contract_outcome_success_before,
                contract_outcome_failure_after: contract_outcome_failure_after,
                contract_outcome_failure_before: contract_outcome_failure_before,
                contract_outcome_cancel_after: contract_outcome_cancel_after,
                contract_outcome_cancel_before: contract_outcome_cancel_before,
                contract_description: contract_subject,
                contract_outcome_deposit_description: contract_outcome_deposit_description,
                contract_outcome_success_description: contract_outcome_success_description,
                contract_outcome_failure_description: contract_outcome_failure_description,
                contract_outcome_cancel_description: contract_outcome_cancel_description,
                contract_outcome_deposit_employer: contract_outcome_deposit_employer,
                contract_outcome_deposit_contractor: contract_outcome_deposit_contractor,
                contract_outcome_deposit_arbiter: contract_outcome_deposit_arbiter,
                contract_outcome_success_employer: contract_outcome_success_employer,
                contract_outcome_success_contractor: contract_outcome_success_contractor,
                contract_outcome_success_arbiter: contract_outcome_success_arbiter,
                contract_outcome_failure_employer: contract_outcome_failure_employer,
                contract_outcome_failure_contractor: contract_outcome_failure_contractor,
                contract_outcome_failure_arbiter: contract_outcome_failure_arbiter,
                contract_outcome_cancel_employer: contract_outcome_cancel_employer,
                contract_outcome_cancel_contractor: contract_outcome_cancel_contractor,
                contract_outcome_cancel_arbiter: contract_outcome_cancel_arbiter
            });
        }}>
            <div className="break-inside-avoid">
                <h2>Contract</h2>
                <p>As your are the contract creator, you <MinaValue>{ context.state.publicKey.toBase58() }</MinaValue> will take the Employer role. You will still need to define Contractor and Arbiter by providing their Mina base58 account addresses.</p>
                <p>The time reference for all the deadlines is current blockchain length <MinaBlockchainLength>{ context.state.blockchainLenght }</MinaBlockchainLength>.</p>
                <KeyGenerator />
            </div>
            <div className="columns-2">
                <div className="break-inside-avoid">
                    <h2>Participants</h2>
                    <div className="form-control">
                        <label className="label">
                            Contractor
                        </label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        <label className="label">
                            <span className="label-text-alt">Contractor is one who does the work in exchange for MINA compensation.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            Arbiter
                        </label>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        <label className="label">
                            <span className="label-text-alt">A person who verifies the outcome of the work in exchange for MINA compensation.</span>
                        </label>
                    </div>
                </div>


                <div className="break-inside-avoid">
                    <h2>Contract subject</h2>
                    <div className="form-control">
                        <label className="label">
                            Written description
                        </label>
                        <textarea className="textarea textarea-secondary" placeholder="What the employer should do?" maxLength="128">
                        </textarea>
                        <label className="label">
                            <span className="label-text-alt">What kind of work needs to be done?</span>
                        </label>
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <h2>Amounts</h2>
                    <h3>Contractor</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contractor payment</span>
                        </label>
                        <label className="input-group">
                            <input type="text" placeholder="0.01" className="input input-bordered" />
                            <span>MINA</span>
                        </label>
                        <label className="label">
                            <span className="label-text-alt">This is the amount contractor gets paid for doing the work correctly within the deadline.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contractor security deposit</span>
                        </label>
                        <label className="input-group">
                            <input type="text" placeholder="0.01" className="input input-bordered" />
                            <span>MINA</span>
                        </label>
                        <label className="label">
                            <span className="label-text-alt">This amount gives the contractor an incentive to play by the rules.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contractor failure penalty</span>
                        </label>
                        <input type="range" min="0" max="100" defaultValue="25" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">This is the amount of lost deposit for the contractor for not doing the work. Percent of the deposit.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contractor cancel penalty</span>
                        </label>
                        <input type="range" min="0" max="100" defaultValue="10" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">This is the amount of lost deposit for the contractor for canceling the contract.</span>
                        </label>
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <h3>Employer</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Employer security deposit</span>
                        </label>
                        <label className="input-group">
                            <input type="text" placeholder="0.01" className="input input-bordered" />
                            <span>MINA</span>
                        </label>
                        <label className="label">
                            <span className="label-text-alt">It need to be greater than the arbitration fee.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Employer arbitration fee share</span>
                        </label>
                        <input type="range" min="0" max="100" defaultValue="50" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">How much of the arbitration fee does the employer pay?</span>
                        </label>
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <div className="break-inside-avoid">
                        <h3>Arbiter</h3>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Arbiter payment</span>
                            </label>
                            <label className="input-group">
                                <input type="text" placeholder="0.01" className="input input-bordered" />
                                <span>MINA</span>
                            </label>
                            <label className="label">
                                <span className="label-text-alt">How much the arbiter is paid for the arbitration service?</span>
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Arbiter security deposit</span>
                            </label>
                            <label className="input-group">
                                <input type="text" placeholder="0.01" className="input input-bordered" />
                                <span>MINA</span>
                            </label>
                            <label className="label">
                                <span className="label-text-alt">It need to be greater than the penalty.</span>
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Non-acting penalty</span>
                            </label>
                            <input type="range" min="0" max="100" defaultValue="50" className="range" step="1" />
                            <label className="label">
                                <span className="label-text-alt">Penalty for not declaring the outcome within the deadline. Has to be lower or equal to the sum of the arbitration fees from the Employer and the Contractor.</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <h2>Deadlines</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Warm-up time</span>
                        </label>
                        <input type="range" min="1" max="10" defaultValue="5" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">How much time from now before the contract starts to accept the deposits.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Deposit time</span>
                        </label>
                        <input type="range" min="1" max="10" defaultValue="5" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">How much time everyone has to deposit. Within this time window it is possible to cancel with no consequences.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Execution time</span>
                        </label>
                        <input type="range" min="1" max="10" defaultValue="5" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">How much time does the Contractor have to do the work.</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Failure declaration time</span>
                        </label>
                        <input type="range" min="1" max="10" defaultValue="5" className="range" step="1" />
                        <label className="label">
                            <span className="label-text-alt">If after deadline, how much time the arbiter has to declare failure.</span>
                        </label>
                    </div>
                </div>

                <div className="break-inside-avoid">
                    <h2>Outcomes written descriptions</h2>
                    <p>Optional, they provide a possibility to justify the amount and deadline choices for each of the outcomes.</p>
                    <div className="form-control">
                        <label className="label">
                            Deposited
                        </label>
                        <textarea className="textarea textarea-secondary" placeholder="">
                        </textarea>
                        <label className="label">
                            <span className="label-text-alt">Justify the deposit policy</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            Success
                        </label>
                        <textarea className="textarea textarea-secondary" placeholder="" maxLength="128">
                        </textarea>
                        <label className="label">
                            <span className="label-text-alt">Justify the success policy</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            Failure
                        </label>
                        <textarea className="textarea textarea-secondary" placeholder="" maxLength="128">
                        </textarea>
                        <label className="label">
                            <span className="label-text-alt">Justify the failure policy</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            Cancel
                        </label>
                        <textarea className="textarea textarea-secondary" placeholder="" maxLength="128">
                        </textarea>
                        <label className="label">
                            <span className="label-text-alt">Justify the cancelation policy</span>
                        </label>
                    </div>
                </div>

                <div className="btn-group btn-group-vertical lg:btn-group-horizontal break-inside-avoid">
                    <button type="submit" className="btn btn-active">Next</button>
                </div>
            </div>
        </form>
)};

export default Editor;
