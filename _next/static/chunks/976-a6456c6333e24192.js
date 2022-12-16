"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[976],{

/***/ 7976:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ interaction; },
  "J": function() { return /* binding */ finalizeContract; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./components/AppContext.tsx
var components_AppContext = __webpack_require__(1799);
// EXTERNAL MODULE: ./components/highlights.tsx
var highlights = __webpack_require__(5399);
// EXTERNAL MODULE: ./node_modules/snarkyjs/dist/web/index.js
var web = __webpack_require__(6400);
;// CONCATENATED MODULE: ./components/txBuilding.tsx


async function txBuilding_contractDeploy(context) {
    const transactionFee = 0.1;
    await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing...",
        tx_command: "deploy"
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createDeployTransactionAuro(context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient.createDeployTransaction(context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    await context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransaction();
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: "",
        tx_command: ""
    });
}
async function txBuilding_contractInit(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing...",
        tx_command: "init"
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createInitTransactionAuro(context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient.createInitTransaction(context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: "",
        tx_command: ""
    });
}
async function txBuilding_contractDeposit(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing...",
        tx_command: "deposit"
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createDepositTransactionAuro(context.state.actorPrivateKey.toPublicKey());
    } else {
        await context.state.zkappWorkerClient.createDepositTransaction(context.state.actorPrivateKey.toPublicKey(), context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: "",
        tx_command: ""
    });
}
async function txBuilding_contractWithdraw(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing..."
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createWithdrawTransactionAuro(context.state.actorPrivateKey.toPublicKey(), context.state.actorPrivateKey);
    } else {
        await context.state.zkappWorkerClient.createWithdrawTransaction(context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ""
    });
}
async function txBuilding_contractCancel(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing..."
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createCancelTransactionAuro(context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient.createCancelTransaction(context.state.actorPrivateKey.toPublicKey(), context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ""
    });
}
async function txBuilding_contractSuccess(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing..."
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createSuccessTransactionAuro(context.state.zkappPrivateKey);
    } else {
        await context.state.zkappWorkerClient.createSuccessTransaction(context.state.actorPrivateKey.toPublicKey(), context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    let _hash = "";
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ""
    });
}
async function txBuilding_contractFailure(context) {
    const transactionFee = 0.1;
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Preparing..."
    });
    if (!context.state.finalized) {
        await finalizeContract(context);
    }
    let connectedAddress = context.connectedAddress;
    if (!context.usingAuro) {
        connectedAddress = context.state.actorPublicKey.toBase58();
    }
    console.log("fetchAccount");
    await context.state.zkappWorkerClient.fetchAccount({
        publicKey: web/* PublicKey.fromBase58 */.nh.fromBase58(connectedAddress)
    });
    console.log("initZkappInstance");
    await context.state.zkappWorkerClient.initZkappInstance(context.state.zkappPublicKey);
    console.log("createDeployTransaction");
    if (context.usingAuro) {
        await context.state.zkappWorkerClient.createFailureTransactionAuro(context.state.actorPrivateKey.toPublicKey(), context.state.actorPrivateKey);
    } else {
        await context.state.zkappWorkerClient.createFailureTransaction(context.state.zkappPrivateKey, context.state.actorPrivateKey);
    }
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Proving..."
    });
    console.log("proveTransaction");
    await context.state.zkappWorkerClient.proveTransaction();
    context.setState({
        ...context.state,
        creatingTransaction: true,
        tx_building_state: "Initiating..."
    });
    console.log("getTransactionJSON");
    if (context.usingAuro) {
        const transactionJSON = await context.state.zkappWorkerClient.getTransactionJSON();
        console.log("sendTransaction");
        console.log(transactionJSON);
        const { hash  } = await window.mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                memo: ""
            }
        });
        await context.setTxHash(hash);
    } else {
        const { hash: hash1  } = await context.state.zkappWorkerClient.sendTransactionSign(context.state.actorPrivateKey);
        console.log("done");
        console.log(hash1);
        await context.setTxHash(hash1);
    }
    await context.setState({
        ...context.state,
        creatingTransaction: false,
        deployed: true,
        tx_building_state: ""
    });
}

;// CONCATENATED MODULE: ./components/ContractRendering.tsx




function minaValue(v) {
    let text = "";
    let va = v / 1000000000;
    if (v >= 0) {
        return "+" + va.toString() + " MINA";
    }
    return va.toString() + " MINA";
}
function outcomeDescription(v) {
    if (v == "") {
        return "N/A";
    }
    return v;
}
const RenderOutcomes = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "overflow-x-auto",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
            className: "table w-full",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Outcome"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "After"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Before"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Employer"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Contractor"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Arbiter"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Total"
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("tbody", {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Deposit"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_deposit_after
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_deposit_before
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_deposit_employer)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_deposit_contractor)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_deposit_arbiter)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_deposit_employer + context.state.contract_outcome_deposit_contractor + context.state.contract_outcome_deposit_arbiter)
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Success"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_success_after
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_success_before
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_success_employer)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_success_contractor)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_success_arbiter)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_success_employer + context.state.contract_outcome_success_contractor + context.state.contract_outcome_success_arbiter)
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Failure"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_failure_after
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_failure_before
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_failure_employer)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_failure_contractor)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_failure_arbiter)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_failure_employer + context.state.contract_outcome_failure_contractor + context.state.contract_outcome_failure_arbiter)
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Cancel"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_cancel_after
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaBlockchainLength */.iC, {
                                        children: context.state.contract_outcome_cancel_before
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_cancel_employer)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_cancel_contractor)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_cancel_arbiter)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: minaValue(context.state.contract_outcome_cancel_employer + context.state.contract_outcome_cancel_contractor + context.state.contract_outcome_cancel_arbiter)
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
const RenderOutcomesDescriptions = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "overflow-x-auto",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
            className: "table w-full",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Outcome"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Description"
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("tbody", {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Deposit"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("i", {
                                        children: outcomeDescription(context.state.contract_outcome_deposit_description)
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Success"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("i", {
                                        children: outcomeDescription(context.state.contract_outcome_success_description)
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Failure"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("i", {
                                        children: outcomeDescription(context.state.contract_outcome_failure_description)
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Cancel"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("i", {
                                        children: outcomeDescription(context.state.contract_outcome_cancel_description)
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
function safeAddressRender(address) {
    if (!address) {
        return "";
    }
    if (address.toBase58) {
        return address.toBase58();
    }
    return "";
}
const RenderInvolvedParties = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "overflow-x-auto",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
            className: "table w-full",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "Party"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                children: "MINA Address"
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("tbody", {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Employer"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                                        children: safeAddressRender(context.state.contract_employer)
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Contractor"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                                        children: safeAddressRender(context.state.contract_contractor)
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                    children: "Arbiter"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                                        children: safeAddressRender(context.state.contract_arbiter)
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
const RenderContractDescription = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                children: "Contract description"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                children: "Involved parties"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(RenderInvolvedParties, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                children: "Outcomes"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(RenderOutcomes, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                children: "Contract subject description"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("blockquote", {
                className: "text-xl italic font-semibold",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    children: context.state.contract_description
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                children: "Outcomes descriptions"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(RenderOutcomesDescriptions, {})
        ]
    });
};

;// CONCATENATED MODULE: ./components/multiwallet.tsx





const InteractionModeUIInfo = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.usingAuro) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
            children: "You are using AURO wallet."
        });
    } else {
        if (context.state.actorPublicKey) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    "You are using ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                        children: "PrivateKey"
                    }),
                    " mode as ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                        children: context.state.actorPublicKey.toBase58()
                    }),
                    "."
                ]
            });
        }
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            children: [
                "You are using ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                    children: "PrivateKey"
                }),
                " mode but the key is not set."
            ]
        });
    }
};
const InteractionModeUIButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn",
        onClick: async (event)=>{
            await context.setState({
                ...context.state,
                usingAuro: !context.state.usingAuro
            });
        },
        children: "Switch"
    });
};
const InteractionModeUIForm = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("form", {
        onSubmit: async (event)=>{
            event.preventDefault();
            const private_key = event.target.base58sk.value;
            try {
                web/* PrivateKey.fromBase58 */._q.fromBase58(private_key);
            } catch (e) {
                return alert("Invalid private key");
            }
            const actor_sk = web/* PrivateKey.fromBase58 */._q.fromBase58(private_key);
            const actor_pk = actor_sk.toPublicKey();
            await context.setState({
                ...context.state,
                actorPrivateKey: actor_sk,
                actorPublicKey: actor_pk
            });
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "form-control",
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                className: "input-group",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionModeUIButton, {}),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                        type: "password",
                        name: "base58sk",
                        className: "input input-bordered w-full max-w-xs"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                        type: "submit",
                        className: "btn btn-active",
                        children: "Update Private Key"
                    })
                ]
            })
        })
    });
};
const InteractionModeUI = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.usingAuro) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionModeUIInfo, {}),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionModeUIButton, {})
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionModeUIInfo, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionModeUIForm, {})
        ]
    });
};

;// CONCATENATED MODULE: ./components/interaction.tsx









async function finalizeContract(context) {
    // instantiate preimage via worker and compute macpack
    await context.state.zkappWorkerClient.definePreimage(context.state.zkappPublicKey.toBase58(), context.state.contract_employer.toBase58(), context.state.contract_contractor.toBase58(), context.state.contract_arbiter.toBase58(), context.state.contract_description, context.state.contract_outcome_deposit_description, Math.abs(context.state.contract_outcome_deposit_after), Math.abs(context.state.contract_outcome_deposit_before), Math.abs(context.state.contract_outcome_deposit_employer), Math.abs(context.state.contract_outcome_deposit_contractor), Math.abs(context.state.contract_outcome_deposit_arbiter), context.state.contract_outcome_success_description, Math.abs(context.state.contract_outcome_success_after), Math.abs(context.state.contract_outcome_success_before), Math.abs(context.state.contract_outcome_success_employer), Math.abs(context.state.contract_outcome_success_contractor), Math.abs(context.state.contract_outcome_success_arbiter), context.state.contract_outcome_failure_description, Math.abs(context.state.contract_outcome_failure_after), Math.abs(context.state.contract_outcome_failure_before), Math.abs(context.state.contract_outcome_failure_employer), Math.abs(context.state.contract_outcome_failure_contractor), Math.abs(context.state.contract_outcome_failure_arbiter), context.state.contract_outcome_cancel_description, Math.abs(context.state.contract_outcome_cancel_after), Math.abs(context.state.contract_outcome_cancel_before), Math.abs(context.state.contract_outcome_cancel_employer), Math.abs(context.state.contract_outcome_cancel_contractor), Math.abs(context.state.contract_outcome_cancel_arbiter));
    // now get its macpack
    const macpack = await context.state.zkappWorkerClient.toMacPack();
    context.setState({
        ...context.state,
        loaded: true,
        macpack: macpack
    });
}
async function contractRefreshState(context) {
    const contract_state = await context.state.zkappWorkerClient.getContractState();
    context.setState({
        ...context.state,
        employerActed: contract_state["acted"]["employer"],
        contractorActed: contract_state["acted"]["contractor"],
        arbiterActed: contract_state["acted"]["arbiter"],
        automatonState: contract_state["automatonState"]
    });
}
const DeployButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (!context.state.deployed) {
        if (context.state.tx_building_state != "" && context.state.tx_command != "deploy") {
            return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                className: "btn btn-disabled animate-pulse",
                children: "Deploy"
            });
        }
        if (context.state.tx_building_state != "" && context.state.tx_command == "deploy") {
            return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                className: "btn btn-primary btn-disabled animate-pulse",
                children: context.state.tx_building_state
            });
        }
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary",
            onClick: async ()=>{
                await txBuilding_contractDeploy(context);
            },
            children: "Deploy"
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-disabled",
        children: "Deploy"
    });
};
const InitButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (!context.state.deployed) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-disabled",
            children: "Initialize"
        });
    } else if (context.state.tx_building_state == "") {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary",
            onClick: async ()=>{
                await txBuilding_contractInit(context);
            },
            children: "Initialize"
        });
    } else if (context.state.tx_building_state != "" && context.state.tx_command != "init") {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary btn-disabled",
            children: "Initialize"
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-disabled animate-pulse",
        children: context.state.tx_building_state
    });
};
const DepositButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.contract_outcome_deposit_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_deposit_before) {
        if (context.state.tx_building_state == "") {
            return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await txBuilding_contractDeposit(context);
                },
                children: "Deposit"
            });
        } else if (context.state.tx_building_state != "" && context.state.tx_command != "deposit") {
            return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                className: "btn btn-disabled",
                children: "Deposit"
            });
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-disabled",
        children: "Deposit"
    });
};
const WithdrawButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.connectedAddress === null || context.blockchainLength < context.state.contract_outcome_deposit_after) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-disabled",
            children: "Withdraw"
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-primary",
        onClick: async ()=>{
            await txBuilding_contractWithdraw(context);
        },
        children: "Withdraw"
    });
};
const SuccessButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.connectedAddress === null) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary btn-disabled",
            children: "Judge success"
        });
    }
    const actor = web/* PublicKey.fromBase58 */.nh.fromBase58(context.connectedAddress);
    if (context.state.contract_outcome_success_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_success_before && actor == context.state.contract_arbiter) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary",
            onClick: async ()=>{
                await txBuilding_contractSuccess(context);
            },
            children: "Judge success"
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-disabled",
        children: "Judge success"
    });
};
const FailureButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.connectedAddress === null) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary btn-disabled",
            children: "Judge failure"
        });
    }
    const actor = web/* PublicKey.fromBase58 */.nh.fromBase58(context.connectedAddress);
    if (context.state.contract_outcome_failure_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_failure_before && actor == context.contract_arbiter) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary",
            onClick: async ()=>{
                await txBuilding_contractFailure(context);
            },
            children: "Judge failure"
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-disabled",
        children: "Judge failure"
    });
};
const CancelButton = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.connectedAddress === null) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-disabled",
            children: "Cancel for free"
        });
    }
    const actor = web/* PublicKey.fromBase58 */.nh.fromBase58(context.connectedAddress);
    if (context.state.contract_outcome_deposit_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_deposit_before) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary",
            onClick: async ()=>{
                await txBuilding_contractCancel(context);
            },
            children: "Cancel for free"
        });
    } else if (context.state.contract_outcome_cancel_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_cancel_before && actor == context.state.contract_contractor) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
            className: "btn btn-primary",
            onClick: async ()=>{
                await txBuilding_contractCancel(context);
            },
            children: "Cancel for penalty"
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-disabled",
        children: "Cancel for penalty"
    });
};
const GodMode = ()=>{
    const context = useContext(AppContext);
    return /*#__PURE__*/ _jsxs("div", {
        children: [
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractDeploy(context);
                },
                children: "God Mode Deploy"
            }),
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractInit(context);
                },
                children: "God Mode Initialize"
            }),
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractDeposit(context);
                },
                children: "God Mode Deposit"
            }),
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractWithdraw(context);
                },
                children: "God Mode Withdraw"
            }),
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractSuccess(context);
                },
                children: "God Mode Judge success"
            }),
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractFailure(context);
                },
                children: "God Mode Judge failure"
            }),
            /*#__PURE__*/ _jsx("button", {
                className: "btn btn-primary",
                onClick: async ()=>{
                    await contractCancel(context);
                },
                children: "God Mode Cancel for free"
            })
        ]
    });
};
const DeploymentInformation = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.deployed) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
            children: "The contract has been deployed."
        });
    } else {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
            children: [
                "The contract is pending deployment.",
                /*#__PURE__*/ (0,jsx_runtime.jsx)(DeployButton, {})
            ]
        });
    }
};
const TxIds = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.txHash != "") {
        const url = "https://berkeley.minaexplorer.com/transaction/" + context.txHash;
        console.log(url);
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            children: [
                "Your last transaction is ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                    href: url,
                    target: "_blank",
                    rel: "noreferrer",
                    children: context.txHash
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {});
};
const ConnectedAccount = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.connectedAddress !== null) {
        const employer = context.state.contract_employer.toBase58();
        const contractor = context.state.contract_contractor.toBase58();
        const arbiter = context.state.contract_arbiter.toBase58();
        switch(context.connectedAddress){
            case employer:
                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                    children: [
                        "Interacting as ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                            children: context.connectedAddress
                        }),
                        ". You take ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                            children: "employer"
                        }),
                        " role in this contract."
                    ]
                });
                break;
            case contractor:
                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                    children: [
                        "Interacting as ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                            children: context.connectedAddress
                        }),
                        ". You take ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                            children: "contractor"
                        }),
                        " role in this contract."
                    ]
                });
                break;
            case arbiter:
                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                    children: [
                        "Interacting as ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                            children: context.connectedAddress
                        }),
                        ". You take ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                            children: "arbiter"
                        }),
                        " role in this contract."
                    ]
                });
                break;
            default:
                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                    children: [
                        "Interacting as ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(highlights/* MinaValue */.L_, {
                            children: context.connectedAddress
                        }),
                        ". You take no role in this contract."
                    ]
                });
                break;
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
        children: "Failed to fetch your account from Auro wallet..."
    });
};
const CancelTimeLine = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.contract_outcome_cancel_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_cancel_before) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
            children: [
                "It is possible to ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                    children: "cancel"
                }),
                " at the current stage with a financial penalty."
            ]
        });
    } else if (context.blockchainLength < context.state.contract_outcome_cancel_before) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
            children: [
                "The option to ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                    children: "cancel"
                }),
                " with a financial penalty has not opened yet."
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
        children: [
            "The option to ",
            /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                children: "cancel"
            }),
            " with a financial penalty has already closed."
        ]
    });
};
const ContractTimeline = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.blockchainLength !== null) {
        if (context.blockchainLength < context.state.contract_outcome_deposit_after) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                children: [
                    "The contract is in the ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                        children: "warm-up"
                    }),
                    " stage"
                ]
            });
        } else if (context.state.contract_outcome_deposit_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_deposit_before) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                children: [
                    "The contract is in the ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                        children: "deposit"
                    }),
                    " stage. It is possible to ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                        children: "cancel"
                    }),
                    " for free with no consequences."
                ]
            });
        } else if (context.state.contract_outcome_success_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_success_before) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        children: [
                            "The contract is in the ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                children: "success declaration"
                            }),
                            " stage."
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(CancelTimeLine, {})
                ]
            });
        } else if (context.state.contract_outcome_failure_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_failure_before) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        children: [
                            "The contract is in the ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                children: "failure declaration"
                            }),
                            " stage."
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(CancelTimeLine, {})
                ]
            });
        } else if (context.state.contract_outcome_failure_after <= context.blockchainLength && context.blockchainLength < context.state.contract_outcome_failure_before) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        children: [
                            "The contract is in the ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                children: "failure declaration"
                            }),
                            " stage."
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(CancelTimeLine, {})
                ]
            });
        } else {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        children: "All the contract stages have expired."
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(CancelTimeLine, {})
                ]
            });
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
        children: "Failed to fetch current blockchain length... It is not possible to establish in which stage current contract is."
    });
};
const EmployerActed = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.employerActed) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Employer has acted."
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {});
};
const ContractorActed = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.contractorActed) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Contractor has acted."
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {});
};
const ArbiterActed = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.state.arbiterActed) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Arbiter has acted."
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {});
};
const WhoActed = ()=>{
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(EmployerActed, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ContractorActed, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ArbiterActed, {})
        ]
    });
};
const InteractionUI = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ConnectedAccount, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ContractTimeline, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(WhoActed, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(TxIds, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(DeployButton, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InitButton, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(DepositButton, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(WithdrawButton, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(SuccessButton, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(FailureButton, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(CancelButton, {})
        ]
    });
};
const InteractionEditor = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (!context.state.deployed) {
        if (context.compilationButtonState < 4) {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    "Your contract is finalized and is is already possible to ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                        href: "/export",
                        children: "export"
                    }),
                    " it using MacPacks. However, it is not available on-chain. Make sure you compile the zk-SNARK circuit first and then you may deploy it. Compilation will take between 7 and 20 minutes so make sure you have some nice show to watch in the meantime."
                ]
            });
        } else {
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        children: "Interaction"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(DeploymentInformation, {})
                ]
            });
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                children: "Interaction"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(DeploymentInformation, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionUI, {})
        ]
    });
};
const InteractionCases = ()=>{
    const context = (0,react.useContext)(components_AppContext/* default */.Z);
    if (context.compilationButtonState < 2) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Make sure you load the SnarkyJS library!"
        });
    } else if (context.connectionButtonState < 2) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Make sure you connect your AuroWallet!"
        });
    } else if (!context.state.loaded) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            children: [
                "Now you may ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                    href: "/create",
                    children: "create a new contract"
                }),
                " or ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                    href: "/import",
                    children: "import an existing contract"
                }),
                "."
            ]
        });
    } else {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionEditor, {}),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(RenderContractDescription, {})
            ]
        });
    }
};
const Interaction = ()=>{
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("article", {
        className: "container prose",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("h1", {
                children: [
                    "Interact with a ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("i", {
                        children: "MAC!"
                    }),
                    " contract"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionModeUI, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InteractionCases, {})
        ]
    });
};
/* harmony default export */ var interaction = (Interaction);


/***/ })

}]);