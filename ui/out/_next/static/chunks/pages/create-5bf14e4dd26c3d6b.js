(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[417],{

/***/ 2109:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/create",
      function () {
        return __webpack_require__(1145);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 1145:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Create; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/snarkyjs/dist/web/index.js
var web = __webpack_require__(6400);
// EXTERNAL MODULE: ./components/AppContext.tsx
var components_AppContext = __webpack_require__(1799);
// EXTERNAL MODULE: ./components/highlights.tsx
var highlights = __webpack_require__(5399);
;// CONCATENATED MODULE: ./components/editor.tsx





async function generateKeyPair(context) {
    const sk = web/* PrivateKey.random */._q.random();
    const pk = sk.toPublicKey();
    context.setState({
        ...context.state,
        zkappPrivateKeyCandidate: sk,
        zkappPublicKeyCandidate: pk
    });
}
const KeyGenerator = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (!context.state.zkappPublicKeyCandidate) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
            children: [
                "Your MAC! contract does not have a private key. Click on ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                    className: "btn",
                    onClick: async (event)=>{
                        event.preventDefault();
                        await generateKeyPair(context);
                        return;
                    },
                    children: "Generate"
                }),
                " to prepare a new key pair."
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
        children: [
            "Your MAC! contract public key and address is ",
            /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                children: context.state.zkappPublicKeyCandidate.toBase58()
            }),
            " and corresponding private key is ",
            /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaSecretValue */.Bl, {
                children: context.state.zkappPrivateKeyCandidate.toBase58()
            })
        ]
    });
};
const Editor = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
        onSubmit: async (event)=>{
            event.preventDefault();
            console.log(event);
            const max_string_length = 128;
            const t = 1 // 2520 is a week, time unit
            ;
            const m = 1000000000 // mina denomination
            ;
            // addresses
            const private_key = event.target.base58sk.value;
            console.log(private_key);
            try {
                web/* PrivateKey.fromBase58 */._q.fromBase58(private_key);
            } catch (e) {
                return alert("Invalid private key");
            }
            // addresses
            const employer = event.target.base58employer.value;
            try {
                web/* PublicKey.fromBase58 */.nh.fromBase58(employer);
            } catch (e1) {
                return alert("Invalid employer address");
            }
            const contractor = event.target.base58contractor.value;
            try {
                web/* PublicKey.fromBase58 */.nh.fromBase58(contractor);
            } catch (e2) {
                return alert("Invalid contractor address");
            }
            const arbiter = event.target.base58arbiter.value;
            try {
                web/* PublicKey.fromBase58 */.nh.fromBase58(arbiter);
            } catch (e3) {
                return alert("Invalid arbiter address");
            }
            const contract_subject = event.target.contract_subject.value;
            // contractor
            const contractor_payment = Math.round(parseFloat(event.target.contractor_payment.value) * m);
            const contractor_deposit = Math.round(parseFloat(event.target.contractor_deposit.value) * m);
            const contracor_penalty_failure_percent = parseInt(event.target.contractor_failure_penalty.value);
            const contracor_penalty_cancel_percent = parseInt(event.target.contractor_cancel_penalty.value);
            // employer
            const employer_deposit = Math.round(parseFloat(event.target.employer_deposit.value) * m);
            const employer_arbitration_fee_percent = parseInt(event.target.employer_arbitration_fee_percent.value);
            // arbiter
            const arbiter_payment = Math.round(parseFloat(event.target.arbiter_payment.value) * m);
            const arbiter_deposit = Math.round(parseFloat(event.target.arbiter_deposit.value) * m);
            const arbiter_penalty_non_acting_percent = parseInt(event.target.arbiter_penalty_non_acting_percent.value);
            // deadlines
            const deadline_warmup = event.target.deadline_warmup.value;
            const deadline_deposit = event.target.deadline_deposit.value;
            const deadline_execution = event.target.deadline_execution.value;
            const deadline_failure = event.target.deadline_failure.value;
            // description
            const subject_deposit = event.target.subject_deposit.value;
            const subject_success = event.target.subject_success.value;
            const subject_failure = event.target.subject_failure.value;
            const subject_cancel = event.target.subject_cancel.value;
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
            const emp_arb = Math.round(employer_arbitration_fee_percent / 100 * arbiter_payment);
            const con_arb = arbiter_payment - emp_arb;
            const con_fail = Math.round(contracor_penalty_failure_percent / 100 * arbiter_payment);
            const con_cancel = Math.round(contracor_penalty_cancel_percent / 100 * arbiter_payment);
            console.log(emp_arb);
            console.log(con_arb);
            console.log(con_fail);
            console.log(con_cancel);
            console.log("outcomes amounts");
            const contract_outcome_deposit_employer = contractor_payment + employer_deposit + emp_arb;
            const contract_outcome_deposit_contractor = contractor_deposit + con_arb;
            const contract_outcome_deposit_arbiter = arbiter_deposit;
            const contract_outcome_success_employer = employer_deposit;
            const contract_outcome_success_contractor = contractor_payment + contractor_deposit;
            const contract_outcome_success_arbiter = arbiter_payment + arbiter_deposit;
            const contract_outcome_failure_employer = contractor_payment + employer_deposit + con_fail;
            const contract_outcome_failure_contractor = contractor_deposit - con_fail;
            const contract_outcome_failure_arbiter = arbiter_payment + arbiter_deposit;
            const contract_outcome_cancel_employer = contractor_payment + employer_deposit + con_cancel;
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
                contract_outcome_cancel_arbiter
            ];
            if (all_values.some((v)=>v < 0)) {
                return alert("One of the contract values ends up negative...");
            }
            // set the participants
            const contract_employer = web/* PublicKey.fromBase58 */.nh.fromBase58(employer);
            const contract_contractor = web/* PublicKey.fromBase58 */.nh.fromBase58(contractor);
            const contract_arbiter = web/* PublicKey.fromBase58 */.nh.fromBase58(arbiter);
            const sk = web/* PrivateKey.fromBase58 */._q.fromBase58(private_key);
            const pk = sk.toPublicKey();
            console.log("sk");
            console.log(sk);
            console.log(pk);
            // set the preimage
            /*
               await context.state.zkappWorkerClient.definePreimage(
               pk.toBase58(),
               employer,
               contractor,
               arbiter,
               contract_subject,
               contract_outcome_deposit_description,
               contract_outcome_deposit_after,
               contract_outcome_deposit_before,
               contract_outcome_deposit_employer,
               contract_outcome_deposit_contractor,
               contract_outcome_deposit_arbiter,
               contract_outcome_success_description,
               contract_outcome_success_after,
               contract_outcome_success_before,
               contract_outcome_success_employer,
               contract_outcome_success_contractor,
               contract_outcome_success_arbiter,
               contract_outcome_failure_description,
               contract_outcome_failure_after,
               contract_outcome_failure_before,
               contract_outcome_failure_employer,
               contract_outcome_failure_contractor,
               contract_outcome_failure_arbiter,
               contract_outcome_cancel_description,
               contract_outcome_cancel_after,
               contract_outcome_cancel_before,
               contract_outcome_cancel_employer,
               contract_outcome_cancel_contractor,
               contract_outcome_cancel_arbiter);

               // now get its macpack
               const macpack = await context.state.zkappWorkerClient.toMacPack();
             */ // set the state
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
                contract_outcome_cancel_arbiter: contract_outcome_cancel_arbiter
            });
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "break-inside-avoid",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        children: "Contract"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        children: [
                            "As your are the contract creator, you ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                                children: context.connectedAddress
                            }),
                            " will take the Employer role. You will still need to define Contractor and Arbiter by providing their Mina base58 account addresses."
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        children: [
                            "The time reference for all the deadlines is current blockchain length ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                children: context.blockchainLength
                            }),
                            "."
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(KeyGenerator, {})
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "columns-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                children: "Deployment"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "zkApp private key"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        type: "password",
                                        name: "base58sk",
                                        className: "input input-bordered w-full max-w-xs"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Required for deployment"
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                children: "Participants"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Employer"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        type: "text",
                                        name: "base58employer",
                                        placeholder: "Type here",
                                        className: "input input-bordered w-full max-w-xs"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Employer is one who needs the service and pays for it."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Contractor"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        type: "text",
                                        name: "base58contractor",
                                        placeholder: "Type here",
                                        className: "input input-bordered w-full max-w-xs"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Contractor is one who does the work in exchange for MINA compensation."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Arbiter"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        type: "text",
                                        name: "base58arbiter",
                                        placeholder: "Type here",
                                        className: "input input-bordered w-full max-w-xs"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "A person who verifies the outcome of the work in exchange for MINA compensation."
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                children: "Contract subject"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Written description"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                        name: "contract_subject",
                                        className: "textarea textarea-secondary",
                                        placeholder: "What the employer should do?",
                                        maxLength: "128"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "What kind of work needs to be done?"
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                children: "Amounts"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                children: "Contractor"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Contractor payment"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                        className: "input-group",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                name: "contractor_payment",
                                                type: "text",
                                                placeholder: "0.01",
                                                className: "input input-bordered"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "MINA"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "This is the amount contractor gets paid for doing the work correctly within the deadline."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Contractor security deposit"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                        className: "input-group",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                name: "contractor_deposit",
                                                type: "text",
                                                placeholder: "0.01",
                                                className: "input input-bordered"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "MINA"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "This amount gives the contractor an incentive to play by the rules."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Contractor failure penalty"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "contractor_failure_penalty",
                                        type: "range",
                                        min: "0",
                                        max: "100",
                                        defaultValue: "25",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "This is the amount of lost deposit for the contractor for not doing the work. Percent of the deposit."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Contractor cancel penalty"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "contractor_cancel_penalty",
                                        type: "range",
                                        min: "0",
                                        max: "100",
                                        defaultValue: "10",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "This is the amount of lost deposit for the contractor for canceling the contract."
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                children: "Employer"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Employer security deposit"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                        className: "input-group",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                name: "employer_deposit",
                                                type: "text",
                                                placeholder: "0.01",
                                                className: "input input-bordered"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                children: "MINA"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "It need to be greater than the arbitration fee."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Employer arbitration fee share"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "employer_arbitration_fee_percent",
                                        type: "range",
                                        min: "0",
                                        max: "100",
                                        defaultValue: "50",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "How much of the arbitration fee does the employer pay?"
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "break-inside-avoid",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "break-inside-avoid",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    children: "Arbiter"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "form-control",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "label",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "label-text",
                                                children: "Arbiter payment"
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                            className: "input-group",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                    name: "arbiter_payment",
                                                    type: "text",
                                                    placeholder: "0.01",
                                                    className: "input input-bordered"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                    children: "MINA"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "label",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "label-text-alt",
                                                children: "How much the arbiter is paid for the arbitration service?"
                                            })
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "form-control",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "label",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "label-text",
                                                children: "Arbiter security deposit"
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                            className: "input-group",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                    name: "arbiter_deposit",
                                                    type: "text",
                                                    placeholder: "0.01",
                                                    className: "input input-bordered"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                    children: "MINA"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "label",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "label-text-alt",
                                                children: "It need to be greater than the penalty."
                                            })
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "form-control",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "label",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "label-text",
                                                children: "Non-acting penalty"
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            name: "arbiter_penalty_non_acting_percent",
                                            type: "range",
                                            min: "0",
                                            max: "100",
                                            defaultValue: "50",
                                            className: "range",
                                            step: "1"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: "label",
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "label-text-alt",
                                                children: "Penalty for not declaring the outcome within the deadline. Has to be lower or equal to the sum of the arbitration fees from the Employer and the Contractor."
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                children: "Deadlines"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Warm-up time"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "deadline_warmup",
                                        type: "range",
                                        min: "1",
                                        max: "10",
                                        defaultValue: "5",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "How much time from now before the contract starts to accept the deposits."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Deposit time"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "deadline_deposit",
                                        type: "range",
                                        min: "1",
                                        max: "10",
                                        defaultValue: "5",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "How much time everyone has to deposit. Within this time window it is possible to cancel with no consequences."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Execution time"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "deadline_execution",
                                        type: "range",
                                        min: "1",
                                        max: "10",
                                        defaultValue: "5",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "How much time does the Contractor have to do the work."
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text",
                                            children: "Failure declaration time"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        name: "deadline_failure",
                                        type: "range",
                                        min: "1",
                                        max: "10",
                                        defaultValue: "5",
                                        className: "range",
                                        step: "1"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "If after deadline, how much time the arbiter has to declare failure."
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "break-inside-avoid",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                children: "Outcomes written descriptions"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                children: "Optional, they provide a possibility to justify the amount and deadline choices for each of the outcomes."
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Deposited"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                        name: "subject_deposit",
                                        className: "textarea textarea-secondary",
                                        placeholder: ""
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Justify the deposit policy"
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Success"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                        name: "subject_success",
                                        className: "textarea textarea-secondary",
                                        placeholder: "",
                                        maxLength: "128"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Justify the success policy"
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Failure"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                        name: "subject_failure",
                                        className: "textarea textarea-secondary",
                                        placeholder: "",
                                        maxLength: "128"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Justify the failure policy"
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "form-control",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: "Cancel"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
                                        name: "subject_cancel",
                                        className: "textarea textarea-secondary",
                                        placeholder: "",
                                        maxLength: "128"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: "label",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "label-text-alt",
                                            children: "Justify the cancelation policy"
                                        })
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "btn-group btn-group-vertical lg:btn-group-horizontal break-inside-avoid",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                            type: "submit",
                            className: "btn btn-active",
                            children: "Next"
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ var editor = (Editor);

;// CONCATENATED MODULE: ./pages/create.page.tsx






const CreationSteps = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                children: "this is where we create a new contract"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                className: "steps",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                        className: "step step-primary",
                        children: "Define"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                        className: "step",
                        children: "Deploy"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                        className: "step",
                        children: "Share!"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                        className: "step",
                        children: "Interact!"
                    })
                ]
            })
        ]
    })) ;
};
const ConnectionIndicator = ()=>{
    const context = useContext(AppContext);
    if (context.connectionButtonState < 2) {
        return /*#__PURE__*/ _jsx("article", {
            className: "container prose",
            children: "Auro wallet not connected."
        });
    }
    return /*#__PURE__*/ _jsxs("article", {
        className: "container prose",
        children: [
            "Connected as ",
            /*#__PURE__*/ _jsx(MinaValue, {
                children: context.connectedAddress
            }),
            "."
        ]
    });
};
const CreateCases = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.compilationButtonState < 2) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("article", {
            className: "container prose",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                    children: "Create a new MAC contract"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        children: "You need to load the SnarkyJS library first!"
                    })
                })
            ]
        });
    }
    if (context.state.loaded) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("article", {
            className: "container prose",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                    children: "Create a new MAC contract"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        children: [
                            "You already have a loaded MAC! contract. You may ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                href: "/current",
                                children: "deploy it or interact with it"
                            }),
                            ", ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                href: "/close",
                                children: "close it"
                            }),
                            " or ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                href: "/export",
                                children: "export it"
                            }),
                            "."
                        ]
                    })
                })
            ]
        });
    }
    if (context.connectionButtonState < 2) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("article", {
            className: "container prose",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                    children: "Create a new MAC contract"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        children: "Make sure you connect your AuroWallet!"
                    })
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("article", {
        className: "container gap-8 prose",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                children: "Create a new MAC contract"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(CreationSteps, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(editor, {})
        ]
    });
};
function Create(param) {
    let { state , setState  } = param;
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(CreateCases, {});
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(2109); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);