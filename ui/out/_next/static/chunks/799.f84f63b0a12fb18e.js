"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[799],{

/***/ 3799:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Outcome": function() { return /* binding */ Outcome; },
/* harmony export */   "Preimage": function() { return /* binding */ Preimage; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);

class Outcome extends (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Struct */ .AU)({
    description: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .CircuitString */ ._G,
    payment_employer: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .UInt64 */ .zM,
    payment_contractor: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .UInt64 */ .zM,
    payment_arbiter: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .UInt64 */ .zM,
    start_after: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .UInt32 */ .xH,
    finish_before: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .UInt32 */ .xH,
}) {
    static hash(v) {
        return snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Poseidon.hash */ .jm.hash(v.description
            .toFields()
            .concat(v.payment_employer.toFields(), v.payment_contractor.toFields(), v.payment_arbiter.toFields(), v.start_after.toFields(), v.finish_before.toFields()));
    }
}
class Preimage extends (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Struct */ .AU)({
    contract: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .CircuitString */ ._G,
    address: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh,
    employer: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh,
    contractor: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh,
    arbiter: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh,
    deposited: Outcome,
    success: Outcome,
    failure: Outcome,
    cancel: Outcome,
}) {
    static hash(v) {
        return snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Poseidon.hash */ .jm.hash(v.contract
            .toFields()
            .concat(v.address.toFields(), v.employer.toFields(), v.contractor.toFields(), v.arbiter.toFields(), v.deposited.description.toFields(), v.deposited.payment_employer.toFields(), v.deposited.payment_contractor.toFields(), v.deposited.payment_arbiter.toFields(), v.deposited.start_after.toFields(), v.deposited.finish_before.toFields(), v.success.description.toFields(), v.success.payment_employer.toFields(), v.success.payment_contractor.toFields(), v.success.payment_arbiter.toFields(), v.success.start_after.toFields(), v.success.finish_before.toFields(), v.failure.description.toFields(), v.failure.payment_employer.toFields(), v.failure.payment_contractor.toFields(), v.failure.payment_arbiter.toFields(), v.failure.start_after.toFields(), v.failure.finish_before.toFields(), v.cancel.payment_employer.toFields(), v.cancel.payment_contractor.toFields(), v.cancel.payment_arbiter.toFields(), v.cancel.start_after.toFields(), v.cancel.finish_before.toFields()));
    }
}


/***/ })

}]);