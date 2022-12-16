(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[914],{

/***/ 7610:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/export",
      function () {
        return __webpack_require__(531);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 531:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _Export; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7294);
/* harmony import */ var _components_AppContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1799);
/* harmony import */ var _components_interaction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7976);





const MacPackContent = ()=>{
    const context = (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(_components_AppContext__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
        className: "",
        children: context.state.macpack
    });
};
async function runExport(context) {
    try {
        if (!context.state.finalized) {
            await (0,_components_interaction__WEBPACK_IMPORTED_MODULE_4__/* .finalizeContract */ .J)(context);
        }
        const macpack = await context.state.zkappWorkerClient.toMacPack();
        console.log("exported correctly");
        context.setState({
            ...context.state,
            loaded: true,
            finalized: true,
            macpack: macpack
        });
    } catch (e) {
        console.log("failed to export");
        console.log(e);
    }
}
const FinalizeButton = ()=>{
    const context = (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(_components_AppContext__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
    if (context.compilationButtonState == 3) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
            className: "btn btn-disabled",
            children: "Finalize"
        });
    } else {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
            className: "btn btn-disabled",
            onClick: async ()=>{
                await runExport(context);
            },
            children: "Finalize"
        });
    }
};
const ExportCases = ()=>{
    const context = (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(_components_AppContext__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
    if (context.compilationButtonState < 2) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "You need to load the SnarkyJS library first!"
            })
        });
    }
    if (!context.state.loaded) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                children: [
                    "You do not have a loaded MAC! contract. There is nothing to export. You may either ",
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                        href: "/create",
                        children: "create"
                    }),
                    " a new contract or ",
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                        href: "/import",
                        children: "import"
                    }),
                    " one."
                ]
            })
        });
    }
    if (!context.state.finalized) {
        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                children: [
                    "You have a loaded MAC! contract but it is not finalized. You may ",
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(FinalizeButton, {}),
                    " it."
                ]
            })
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "Here below you will find the MacPack corresponding to your zkApp. Youmay share it with remaining participants allowing them to participate."
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "rounded-md not-prose bg-primary text-primary-content",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: "p-4",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MacPackContent, {})
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "Send the above MacPack to the remaining parties of your zkApp and instruct them to import it in order to participate!"
            })
        ]
    });
};
function _Export() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("article", {
            className: "container prose",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                    children: "Export"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ExportCases, {})
            ]
        })
    });
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [976,774,888,179], function() { return __webpack_exec__(7610); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);