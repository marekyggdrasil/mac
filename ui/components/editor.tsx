import { useContext } from 'react';
import AppContext from './AppContext';


const Editor = () => {
    const context = useContext(AppContext);
    return (
        <form>
            <div className="break-inside-avoid">
                <h2>Participants</h2>
                <div className="form-control">
                    <label className="label">
                        Employer
                    </label>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    <label className="label">
                        <span className="label-text-alt">Employer is one who requests some work to be done...</span>
                    </label>
                </div>
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
                <div className="form-control">
                    <label className="label">
                        Contract subject
                    </label>
                    <textarea className="textarea textarea-secondary" placeholder="What the employer should do?">
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
                        <span className="label-text">Contractor failure penalty</span>
                    </label>
                    <label className="input-group">
                        <input type="text" placeholder="0.01" className="input input-bordered" />
                        <span>MINA</span>
                    </label>
                    <label className="label">
                        <span className="label-text-alt">This is the amount of lost deposit for the contractor for not doing the work.</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Contractor cancel penalty</span>
                    </label>
                    <label className="input-group">
                        <input type="text" placeholder="0.01" className="input input-bordered" />
                        <span>MINA</span>
                    </label>
                    <label className="label">
                        <span className="label-text-alt">This is the amount of lost deposit for the contractor for canceling the contract.</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Contractor arbitration fee</span>
                    </label>
                    <label className="input-group">
                        <input type="text" placeholder="0.01" className="input input-bordered" />
                        <span>MINA</span>
                    </label>
                    <label className="label">
                        <span className="label-text-alt">How much contractor pays to the arbiter.</span>
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
                        <span className="label-text-alt">It need to be greater than highest of the penalties with arbitration fee.</span>
                    </label>
                </div>
            </div>

            <div className="break-inside-avoid">
                <h3>Employer</h3>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Employer arbitration fee</span>
                    </label>
                    <label className="input-group">
                        <input type="text" placeholder="0.01" className="input input-bordered" />
                        <span>MINA</span>
                    </label>
                    <label className="label">
                        <span className="label-text-alt">How much the Employer pays to the arbiter.</span>
                    </label>
                </div>
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
            </div>

            <div className="break-inside-avoid">
                <div className="break-inside-avoid">
                    <h3>Arbiter</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Non-acting penalty</span>
                        </label>
                        <label className="input-group">
                            <input type="text" placeholder="0.01" className="input input-bordered" />
                            <span>MINA</span>
                        </label>
                        <label className="label">
                            <span className="label-text-alt">Penalty for not declaring the outcome within the deadline. Has to be lower or equal to the sum of the arbitration fees from the Employer and the Contractor.</span>
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
                </div>
            </div>

            <div className="break-inside-avoid">
                <h2>Deadlines</h2>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Warm-up time</span>
                    </label>
                    <input type="range" min="0" max="100" defaultValue="40" className="range" step="1" />
                    <label className="label">
                        <span className="label-text-alt">How much time from now before the contract starts to accept the deposits.</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Deposit time</span>
                    </label>
                    <input type="range" min="0" max="100" defaultValue="40" className="range" step="1" />
                    <label className="label">
                        <span className="label-text-alt">How much time everyone has to deposit. Within this time window it is possible to cancel with no consequences.</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Execution time</span>
                    </label>
                    <input type="range" min="0" max="100" defaultValue="40" className="range" step="1" />
                    <label className="label">
                        <span className="label-text-alt">How much time does the Contractor have to do the work.</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Failure declaration time</span>
                    </label>
                    <input type="range" min="0" max="100" defaultValue="40" className="range" step="1" />
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
                    <textarea className="textarea textarea-secondary" placeholder="">
                    </textarea>
                    <label className="label">
                        <span className="label-text-alt">Justify the success policy</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        Failure
                    </label>
                    <textarea className="textarea textarea-secondary" placeholder="">
                    </textarea>
                    <label className="label">
                        <span className="label-text-alt">Justify the failure policy</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        Cancel
                    </label>
                    <textarea className="textarea textarea-secondary" placeholder="">
                    </textarea>
                    <label className="label">
                        <span className="label-text-alt">Justify the cancelation policy</span>
                    </label>
                </div>
            </div>

            <div className="btn-group btn-group-vertical lg:btn-group-horizontal break-inside-avoid">
                <button className="btn btn-active">Next</button>
            </div>
        </form>
)};

export default Editor;
