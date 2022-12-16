(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[74],{

/***/ 7923:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/import",
      function () {
        return __webpack_require__(6945);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 6945:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _Import; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7294);
/* harmony import */ var _components_AppContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1799);
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6400);





async function runImport(context) {
    let element = document.getElementById("import-macpack");
    let macpack = element.innerText || element.textContent;
    console.log(macpack);
    try {
        await context.state.zkappWorkerClient.fromMacPack(macpack);
        console.log("imported correctly");
        // get the preimage to app state for the display
        const r = await context.state.zkappWorkerClient.getPreimageData();
        console.log("preimage data");
        console.log(r);
        console.log(r.address);
        // context.setState({ ...context.state, loaded: true, macpack: macpack });
        let zkAppPublicKey = snarkyjs__WEBPACK_IMPORTED_MODULE_4__/* .PublicKey.fromBase58 */ .nh.fromBase58(r.address);
        await context.state.zkappWorkerClient.initZkappInstance(zkAppPublicKey);
        const account = await context.state.zkappWorkerClient.fetchAccount({
            publicKey: zkAppPublicKey
        });
        let is_deployed = false;
        if (account.account !== undefined) {
            is_deployed = true;
            const on_chain_state = await context.state.zkappWorkerClient.getContractState();
            console.log(on_chain_state);
        }
        // set the state
        context.setState({
            ...context.state,
            loaded: true,
            finalized: true,
            deployed: is_deployed,
            macpack: macpack,
            zkappPublicKey: zkAppPublicKey,
            contract_employer: snarkyjs__WEBPACK_IMPORTED_MODULE_4__/* .PublicKey.fromBase58 */ .nh.fromBase58(r.employer),
            contract_contractor: snarkyjs__WEBPACK_IMPORTED_MODULE_4__/* .PublicKey.fromBase58 */ .nh.fromBase58(r.contractor),
            contract_arbiter: snarkyjs__WEBPACK_IMPORTED_MODULE_4__/* .PublicKey.fromBase58 */ .nh.fromBase58(r.arbiter),
            contract_outcome_deposit_after: r.contract_outcome_deposit_after,
            contract_outcome_deposit_before: r.contract_outcome_deposit_before,
            contract_outcome_success_after: r.contract_outcome_success_after,
            contract_outcome_success_before: r.contract_outcome_success_before,
            contract_outcome_failure_after: r.contract_outcome_failure_after,
            contract_outcome_failure_before: r.contract_outcome_failure_before,
            contract_outcome_cancel_after: r.contract_outcome_cancel_after,
            contract_outcome_cancel_before: r.contract_outcome_cancel_before,
            contract_description: r.contract_description,
            contract_outcome_deposit_description: r.contract_outcome_deposit_description,
            contract_outcome_success_description: r.contract_outcome_success_description,
            contract_outcome_failure_description: r.contract_outcome_failure_description,
            contract_outcome_cancel_description: r.contract_outcome_cancel_description,
            contract_outcome_deposit_employer: -r.contract_outcome_deposit_employer,
            contract_outcome_deposit_contractor: -r.contract_outcome_deposit_contractor,
            contract_outcome_deposit_arbiter: -r.contract_outcome_deposit_arbiter,
            contract_outcome_success_employer: r.contract_outcome_success_employer,
            contract_outcome_success_contractor: r.contract_outcome_success_contractor,
            contract_outcome_success_arbiter: r.contract_outcome_success_arbiter,
            contract_outcome_failure_employer: r.contract_outcome_failure_employer,
            contract_outcome_failure_contractor: r.contract_outcome_failure_contractor,
            contract_outcome_failure_arbiter: r.contract_outcome_failure_arbiter,
            contract_outcome_cancel_employer: r.contract_outcome_cancel_employer,
            contract_outcome_cancel_contractor: r.contract_outcome_cancel_contractor,
            contract_outcome_cancel_arbiter: r.contract_outcome_cancel_arbiter
        });
    } catch (e) {
        console.log("failed to import");
        console.log(e);
    }
}
const ImportCases = ()=>{
    const context = (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(_components_AppContext__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
    if (context.compilationButtonState < 2) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "You need to load the SnarkyJS library first!"
            })
        });
    }
    if (context.state.loaded) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                children: [
                    "You already have a loaded MAC! contract. Before you import another one make sure you ",
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                        href: "/close",
                        children: "close"
                    }),
                    " is first."
                ]
            })
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "The code section below is editable. Click on it and paste your MACPACK message."
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "rounded-md not-prose bg-primary text-primary-content",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "p-4",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
                        contentEditable: "true",
                        id: "import-macpack",
                        children: "Paste your MACPACK here..."
                    })
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "Then hit the import button below!"
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                className: "btn",
                onClick: async ()=>{
                    await runImport(context);
                },
                children: "Import"
            })
        ]
    });
};
function _Import() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("article", {
            className: "container prose",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                    children: "Import Contract"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ImportCases, {})
            ]
        })
    });
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(7923); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);