import React from "react";

import { PublicKey, PrivateKey } from "o1js";

import { MacContextType, CastContext } from "./AppContext";
import { MinaValue, MinaBlockchainLength, MinaSecretValue } from "./highlights";

async function generateKeyPair(context: MacContextType) {
  const sk: PrivateKey = PrivateKey.random();
  const pk: PublicKey = sk.toPublicKey();
  context.setState({
    ...context.state,
    zkappPrivateKeyCandidate: sk,
    zkappPublicKeyCandidate: pk,
  });
}

const KeyGenerator = () => {
  const context: MacContextType = CastContext();
  if (context.state.zkappPublicKeyCandidate.isEmpty().toBoolean()) {
    return (
      <p>
        Your MAC! contract does not have a private key. Click on{" "}
        <button
          className="btn"
          onClick={async (event) => {
            event.preventDefault();
            await generateKeyPair(context);
            return;
          }}
        >
          Generate
        </button>{" "}
        to prepare a new key pair.
      </p>
    );
  }
  let zkapp_pk = "";
  if (context.state.zkappPublicKeyCandidate !== null) {
    zkapp_pk = context.state.zkappPublicKeyCandidate.toBase58();
  }
  let zkapp_sk = "";
  if (context.state.zkappPrivateKeyCandidate !== null) {
    zkapp_sk = context.state.zkappPrivateKeyCandidate.toBase58();
  }
  return (
    <p>
      Your MAC! contract public key and address is{" "}
      <MinaValue>{zkapp_pk}</MinaValue> and corresponding private key is{" "}
      <MinaSecretValue>{zkapp_sk}</MinaSecretValue>
    </p>
  );
};

const ComponentAccordion = (props) => {
  return (
    <div className="accordion">
      <div class="join join-vertical w-full">
        { props.children }
      </div>
    </div>
  );
}

const ComponentCollapse = (props) => {
  return (
    <div className="collapse collapse-arrow join-item border border-white-300">
      <input type="radio" name={props.component_name} />
      <div className="collapse-title font-bold">{ props.title }</div>
      <div className="collapse-content">
        { props.children }
      </div>
    </div>
  );
}

const ComponentText = (
  label: string,
  name: string,
  placeholder: string,
  length: number,
  alt: string
) => {
  return <div className="form-control">
    <label className="label">{label}</label>
    <textarea
      name={name}
      className="textarea textarea-secondary"
      placeholder={placeholder}
      maxLength={length}
    ></textarea>
    <label className="label">
      <span className="label-text-alt">
        {alt}
      </span>
    </label>
  </div>;
}

const ComponentDeadline = (
  label: string,
  name: string,
  min_value: string,
  max_value: string,
  default_value: string,
  step: string,
  unit: string,
  description: string
) => {
  return <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <label className="input-group">
      <input
        name={name}
        type="number"
        min={min_value}
        max={max_value}
        defaultValue={default_value}
        className="input input-bordered"
        step={step}
      />
      <span>{unit}</span>
    </label>
    <label className="label">
      <span className="label-text-alt">
        {description}
      </span>
    </label>
  </div>;
}

const ComponentRange = (
  label: string,
  name: string,
  min_value: string,
  max_value: string,
  default_value: string,
  step: string,
  description: string
) => {
  return <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <input
      name={name}
      type="range"
      min={min_value}
      max={max_value}
      defaultValue="{default_value}"
      className="range"
      step={step}
    />
    <label className="label">
      <span className="label-text-alt">
        {description}
      </span>
    </label>
  </div>;
}

const ComponentAmountMINA = (
  label: string,
  name: string,
  placeholder: string,
  unit: string,
  description: string
) => {
  return <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <label className="input-group">
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className="input input-bordered"
      />
      <span>{unit}</span>
    </label>
    <label className="label">
      <span className="label-text-alt">
        {description}
      </span>
    </label>
  </div>;
}

const ComponentSecretKey = (label: string, name: string, description: string) => {
  return <div className="form-control">
    <label className="label">{label}</label>
    <input
      type="password"
      name={name}
      className="input input-bordered w-full max-w-xs"
    />
    <label className="label">
      <span className="label-text-alt">{description}</span>
    </label>
  </div>;
}

const ComponentPublicKey = (
  label: string,
  name: string,
  placeholder: string,
  description: string) => {
    return <div className="form-control">
      <label className="label">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs"
      />
      <label className="label">
        <span className="label-text-alt">
          {description}
        </span>
      </label>
    </div>;
  }

const EntrySecretKey = () => {
  return ComponentSecretKey(
    "zkApp private key",
    "base58sk",
    "Required for deployment"
  );
}

const EntryEmployer = () => {
  return ComponentPublicKey(
    "Employer",
    "base58employer",
    "Type here",
    "Employer is one who needs the service and pays for it."
  );
}

const EntryContractor = () => {
  return ComponentPublicKey(
    "Contractor",
    "base58contractor",
    "Type here",
    "Contractor is one who does the work in exchange for MINA compensation."
  );
}

const EntryArbiter = () => {
  return ComponentPublicKey(
    "Arbiter",
    "base58arbiter",
    "Type here",
    "A person who verifies the outcome of the work in exchange for MINA compensation."
  );
}

const EntryContractSubject = () => {
  return ComponentText(
    "Written description",
    "contract_subject",
    "What the employer should do?",
    128,
    "What kind of work needs to be done?"
  );
}

const EntryContractorPayment = () => {
  return ComponentAmountMINA(
    "Contractor payment",
    "contractor_payment",
    "0.01",
    "MINA",
    "This is the amount contractor gets paid for doing the work correctly within the deadline."
  );
}

const EntryContractorSecurityDeposit = () => {
  return ComponentAmountMINA(
    "Contractor security deposit",
    "contractor_deposit",
    "0.01",
    "MINA",
    "This amount gives the contractor an incentive to play by the rules."
  );
}

const EntryContractorNonActingPenalty = () => {
  return ComponentRange(
    "Contractor failure penalty",
    "contractor_failure_penalty",
    "0",
    "100",
    "25",
    "1",
    "This is the amount of lost deposit for the contractor for not doing the work. Percent of the deposit."
  );
}

const EntryContractorCancelPenalty = () => {
  return ComponentRange(
    "Contractor cancel penalty",
    "contractor_cancel_penalty",
    "0",
    "100",
    "50",
    "1",
    "This is the amount of lost deposit for the contractor for canceling the contract."
  );
}

const EntryEmployerSecurityDeposit = () => {
  return ComponentAmountMINA(
    "Employer security deposit",
    "employer_deposit",
    "0.01",
    "MINA",
    "It need to be greater than the arbitration fee."
  );
}

const EntryEmployerArbitrationFeeShare = () => {
  return ComponentRange(
    "Employer arbitration fee share",
    "employer_arbitration_fee_percent",
    "0",
    "100",
    "50",
    "1",
    "How much of the arbitration fee does the employer pay?"
  );
}

const EntryArbiterPayment = () => {
  return ComponentAmountMINA(
    "Arbiter payment",
    "arbiter_payment",
    "0.01",
    "MINA",
    "How much the arbiter is paid for the arbitration service?"
  );
}

const EntryArbiterSecurityDeposit = () => {
  return ComponentAmountMINA(
    "Arbiter security deposit",
    "arbiter_deposit",
    "0.01",
    "MINA",
    "It need to be greater than the penalty."
  );
}

const EntryArbiterNonActingPenalty = () => {
  return ComponentRange(
    "Non-acting penalty",
    "arbiter_penalty_non_acting_percent",
    "0",
    "100",
    "50",
    "1",
    "Penalty for not declaring the outcome within the deadline. Has to be lower or equal to the sum of the arbitration fees from the Employer and the Contractor."
  );
}

const EntryDeadlineWarmUp = () => {
  return ComponentDeadline(
    "Warm-up time",
    "deadline_warmup",
    "1",
    "",
    "480",
    "1",
    "Blocks",
    "How much time from now before the contract starts to accept the deposits."
  );
}

const EntryDeadlineDeposit = () => {
  return ComponentDeadline(
    "Deposit time",
    "deadline_deposit",
    "1",
    "",
    "480",
    "1",
    "Blocks",
    "How much time everyone has to deposit. Within this time window it is possible to cancel with no consequences."
  );
}

const EntryDeadlineExecution = () => {
  return ComponentDeadline(
    "Execution time",
    "deadline_execution",
    "1",
    "",
    "480",
    "1",
    "Blocks",
    "How much time does the Contractor have to do the work."
  );
}

const EntryDeadlineFailureDeclaration = () => {
  return ComponentDeadline(
    "Failure declaration time",
    "deadline_failure",
    "1",
    "",
    "480",
    "1",
    "Blocks",
    "If after deadline, how much time the arbiter has to declare failure."
  );
}

const EntryOutcomesDeposited = () => {
  return ComponentText(
    "Deposited",
    "subject_deposit",
    "",
    128,
    "Justify the deposit policy"
  );
}

const EntryOutcomesSuccess = () => {
  return ComponentText(
    "Success",
    "subject_success",
    "",
    128,
    "Justify the success policy"
  );
}

const EntryOutcomesFailure = () => {
  return ComponentText(
    "Failure",
    "subject_failure",
    "",
    128,
    "Justify the failure policy"
  );
}

const EntryOutcomesCancel = () => {
  return ComponentText(
    "Cancel",
    "subject_cancel",
    "",
    128,
    "Justify the cancelation policy"
  );
}

async function EditorFormSubmission(
  event: React.SyntheticEvent, context: MacContextType) {
  event.preventDefault();
  console.log(event);

  const max_string_length = 128;
  const t = 1; // 2520 is a week, time unit
  const m = 1000000000; // mina denomination

  // addresses
  const private_key = (event.target as any).base58sk.value;
  console.log(private_key);
  try {
    PrivateKey.fromBase58(private_key);
  } catch (e: any) {
    return alert("Invalid private key");
  }

  // addresses
  const employer = (event.target as any).base58employer.value;
  try {
    PublicKey.fromBase58(employer);
  } catch (e: any) {
    return alert("Invalid employer address");
  }

  const contractor = (event.target as any).base58contractor.value;
  try {
    PublicKey.fromBase58(contractor);
  } catch (e: any) {
    return alert("Invalid contractor address");
  }

  const arbiter = (event.target as any).base58arbiter.value;
  try {
    PublicKey.fromBase58(arbiter);
  } catch (e: any) {
    return alert("Invalid arbiter address");
  }

  const contract_subject = (event.target as any).contract_subject.value;

  // contractor
  const contractor_payment = Math.round(
    parseFloat((event.target as any).contractor_payment.value) * m,
  );
  const contractor_deposit = Math.round(
    parseFloat((event.target as any).contractor_deposit.value) * m,
  );
  const contracor_penalty_failure_percent = parseInt(
    (event.target as any).contractor_failure_penalty.value,
  );
  const contracor_penalty_cancel_percent = parseInt(
    (event.target as any).contractor_cancel_penalty.value,
  );

  // employer
  const employer_deposit = Math.round(
    parseFloat((event.target as any).employer_deposit.value) * m,
  );
  const employer_arbitration_fee_percent = parseInt(
    (event.target as any).employer_arbitration_fee_percent.value,
  );

  // arbiter
  const arbiter_payment = Math.round(
    parseFloat((event.target as any).arbiter_payment.value) * m,
  );
  const arbiter_deposit = Math.round(
    parseFloat((event.target as any).arbiter_deposit.value) * m,
  );
  const arbiter_penalty_non_acting_percent = parseInt(
    (event.target as any).arbiter_penalty_non_acting_percent.value,
  );

  // deadlines
  const deadline_warmup = (event.target as any).deadline_warmup.value;
  const deadline_deposit = (event.target as any).deadline_deposit.value;
  const deadline_execution = (event.target as any).deadline_execution.value;
  const deadline_failure = (event.target as any).deadline_failure.value;

  // description
  const subject_deposit = (event.target as any).subject_deposit.value;
  const subject_success = (event.target as any).subject_success.value;
  const subject_failure = (event.target as any).subject_failure.value;
  const subject_cancel = (event.target as any).subject_cancel.value;

  // compute the values
  const l = context.blockchainLength;
  const a = Math.round(deadline_warmup * t);
  const b = Math.round(deadline_deposit * t);
  const c = Math.round(deadline_execution * t);
  const d = Math.round(deadline_failure * t);

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
  console.log("helper values");
  const emp_arb = Math.round(
    (employer_arbitration_fee_percent / 100) * arbiter_payment,
  );

  const con_arb = arbiter_payment - emp_arb;
  const con_fail = Math.round(
    (contracor_penalty_failure_percent / 100) * arbiter_payment,
  );
  const con_cancel = Math.round(
    (contracor_penalty_cancel_percent / 100) * arbiter_payment,
  );

  console.log(emp_arb);
  console.log(con_arb);
  console.log(con_fail);
  console.log(con_cancel);

  console.log("outcomes amounts");
  const contract_outcome_deposit_employer =
    contractor_payment + employer_deposit + emp_arb;
  const contract_outcome_deposit_contractor = contractor_deposit + con_arb;
  const contract_outcome_deposit_arbiter = arbiter_deposit;

  const contract_outcome_success_employer = employer_deposit;
  const contract_outcome_success_contractor =
    contractor_payment + contractor_deposit;
  const contract_outcome_success_arbiter = arbiter_payment + arbiter_deposit;

  const contract_outcome_failure_employer =
    contractor_payment + employer_deposit + con_fail;
  const contract_outcome_failure_contractor = contractor_deposit - con_fail;
  const contract_outcome_failure_arbiter = arbiter_payment + arbiter_deposit;

  const contract_outcome_cancel_employer =
    contractor_payment + employer_deposit + con_cancel;
  const contract_outcome_cancel_contractor = contractor_deposit - con_cancel;
  const contract_outcome_cancel_arbiter = arbiter_payment + arbiter_deposit;

  // validate values positive
  const all_values = [
    contract_outcome_deposit_employer,
    contract_outcome_deposit_contractor,
    contract_outcome_deposit_arbiter,
    contract_outcome_success_employer,
    contract_outcome_success_contractor,
    contract_outcome_success_arbiter,
    contract_outcome_failure_employer,
    contract_outcome_failure_contractor,
    contract_outcome_failure_arbiter,
    contract_outcome_cancel_employer,
    contract_outcome_cancel_contractor,
    contract_outcome_cancel_arbiter,
  ];
  if (all_values.some((v) => v < 0)) {
    return alert("One of the contract values ends up negative...");
  }
  // set the participants
  const contract_employer = PublicKey.fromBase58(employer);
  const contract_contractor = PublicKey.fromBase58(contractor);
  const contract_arbiter = PublicKey.fromBase58(arbiter);

  const sk = PrivateKey.fromBase58(private_key);
  const pk = sk.toPublicKey();
  console.log("sk");
  console.log(sk);
  console.log(pk);

  // set the state
  await context.setState({
    ...context.state,
    loaded: true,
    deployed: false,
    finalized: false,
    zkappPrivateKey: sk,
    zkappPublicKey: pk,
    contract_employer: contract_employer,
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
    contract_outcome_deposit_employer: -contract_outcome_deposit_employer,
    contract_outcome_deposit_contractor: -contract_outcome_deposit_contractor,
    contract_outcome_deposit_arbiter: -contract_outcome_deposit_arbiter,
    contract_outcome_success_employer: contract_outcome_success_employer,
    contract_outcome_success_contractor: contract_outcome_success_contractor,
    contract_outcome_success_arbiter: contract_outcome_success_arbiter,
    contract_outcome_failure_employer: contract_outcome_failure_employer,
    contract_outcome_failure_contractor: contract_outcome_failure_contractor,
    contract_outcome_failure_arbiter: contract_outcome_failure_arbiter,
    contract_outcome_cancel_employer: contract_outcome_cancel_employer,
    contract_outcome_cancel_contractor: contract_outcome_cancel_contractor,
    contract_outcome_cancel_arbiter: contract_outcome_cancel_arbiter,
  });
}

const Editor = () => {
  const context: MacContextType = CastContext();
  return (
    <form onSubmit={
    async (event) => {
      await EditorFormSubmission(event, context);
    }}>
      <p>
        As your are the contract creator, you{" "}
        <MinaValue>{context.connectedAddress}</MinaValue> will take the
        Employer role. You will still need to define Contractor and Arbiter by
        providing their Mina base58 account addresses.
      </p>
      <p>
        The time reference for all the deadlines is current blockchain length{" "}
        <MinaBlockchainLength>
          {context.blockchainLength}
        </MinaBlockchainLength>
        .
      </p>
      <KeyGenerator />
      <ComponentAccordion>
        <ComponentCollapse title="Deployment" component_name="my-accordion-1">
          <EntrySecretKey />
        </ComponentCollapse>
        <ComponentCollapse title="Participants" component_name="my-accordion-1">
          <EntryEmployer />
          <EntryContractor />
          <EntryArbiter />
        </ComponentCollapse>
        <ComponentCollapse title="Contract subject" component_name="my-accordion-1">
          <EntryContractSubject />
        </ComponentCollapse>
        <ComponentCollapse title="Amounts - Contractor" component_name="my-accordion-1">
          <EntryContractorPayment />
          <EntryContractorSecurityDeposit />
          <EntryContractorNonActingPenalty />
          <EntryContractorCancelPenalty />
        </ComponentCollapse>
        <ComponentCollapse title="Amounts - Employer" component_name="my-accordion-1">
          <EntryEmployerSecurityDeposit />
          <EntryEmployerArbitrationFeeShare />
        </ComponentCollapse>
        <ComponentCollapse title="Amounts - Arbiter" component_name="my-accordion-1">
          <EntryArbiterPayment />
          <EntryArbiterSecurityDeposit />
          <EntryArbiterNonActingPenalty />
        </ComponentCollapse>
        <ComponentCollapse title="Deadlines" component_name="my-accordion-1">
          <EntryDeadlineWarmUp />
          <EntryDeadlineDeposit />
          <EntryDeadlineExecution />
          <EntryDeadlineFailureDeclaration />
        </ComponentCollapse>
        <ComponentCollapse title="Outcomes written descriptions" component_name="my-accordion-1">
          <p>
            Optional, they provide a possibility to justify the amount and
            deadline choices for each of the outcomes.
          </p>
          <EntryOutcomesDeposited />
          <EntryOutcomesSuccess />
          <EntryOutcomesFailure />
          <EntryOutcomesCancel />
        </ComponentCollapse>
      </ComponentAccordion>
      <div className="btn-group btn-group-vertical lg:btn-group-horizontal break-inside-avoid">
        <button type="submit" className="btn btn-active">
          Next
        </button>
      </div>
    </form>
  );
};

export default Editor;
