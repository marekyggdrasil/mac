"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[941,799],{

/***/ 8941:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mac": function() { return /* binding */ Mac; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);
/* harmony import */ var _strpreim__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3799);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


const state_initial = 0;
const state_deposited = 1;
const state_canceled_early = 2;
const state_canceled = 3;
const state_succeeded = 4;
const state_failed = 5;
class Mac extends snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .SmartContract */ .C3 {
    constructor() {
        super(...arguments);
        // on-chain state is public
        this.commitment = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
        // 0 - initial
        // 1 - everyone deposited
        // 2 - someone decided to cancel
        // 3 - contract succeeded
        // 4 - contract failed
        this.automaton_state = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
        // E - employer
        // C - contractor
        // A - arbiter
        //
        // ECA
        // 000 - 0
        // 001 - 1
        // 010 - 2
        // 011 - 3
        // 100 - 4
        // 101 - 5
        // 110 - 6
        // 111 - 7
        this.memory = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
    }
    // ...and method arguments are private, beautiful, right?
    deploy(args) {
        super.deploy(args);
        this.setPermissions({
            ...snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Permissions["default"] */ .Pl["default"](),
            editState: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Permissions.proof */ .Pl.proof(),
            send: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Permissions.proof */ .Pl.proof(),
        });
    }
    initialize(commitment) {
        this.commitment.set(commitment);
        this.automaton_state.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0));
        this.memory.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0));
    }
    deposit(contract_preimage, actor) {
        const commitment = this.commitment.get();
        this.commitment.assertEquals(commitment);
        const automaton_state = this.automaton_state.get();
        this.automaton_state.assertEquals(automaton_state);
        const memory = this.memory.get();
        this.memory.assertEquals(memory);
        const blockchain_length = this.network.blockchainLength.get();
        this.network.blockchainLength.assertEquals(blockchain_length);
        // make sure this is the right contract by checking if
        // the caller is in possession of the correct preimage
        commitment.assertEquals(_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage.hash(contract_preimage));
        // check if the deposit deadline is respected
        blockchain_length.assertGte(contract_preimage.deposited.start_after);
        blockchain_length.assertLt(contract_preimage.deposited.finish_before);
        // make sure the caller is a party in the contract
        actor
            .equals(contract_preimage.arbiter)
            .or(actor.equals(contract_preimage.contractor))
            .or(actor.equals(contract_preimage.employer))
            .assertTrue();
        // only someone who has not yet deposited can deposit
        const actions = memory.toBits(3);
        const acted = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.employer), actions[2], snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.contractor), actions[1], actions[0]));
        const has_not_acted = acted.not();
        has_not_acted.assertTrue();
        // do the deposit
        const amount = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.employer), contract_preimage.deposited.payment_employer, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.contractor), contract_preimage.deposited.payment_contractor, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.arbiter), contract_preimage.deposited.payment_arbiter, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .UInt64.from */ .zM.from(0))));
        // transfer the funds
        const payerUpdate = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .AccountUpdate.create */ .nx.create(actor);
        payerUpdate.send({ to: this.address, amount: amount });
        // update the memory
        actions[2] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.employer), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(true), actions[2]);
        actions[1] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.contractor), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(true), actions[1]);
        actions[0] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.arbiter), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(true), actions[0]);
        // check if everyone acted
        const has_everyone_acted = actions[0].and(actions[1]).and(actions[2]);
        // update the memory
        const new_memory = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](has_everyone_acted, (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0), snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field.fromBits */ .gN.fromBits(actions));
        this.memory.set(new_memory);
        // update state
        const new_state = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](has_everyone_acted, (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_deposited), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_initial));
        this.automaton_state.set(new_state);
    }
    withdraw(contract_preimage, actor) {
        const commitment = this.commitment.get();
        this.commitment.assertEquals(commitment);
        const automaton_state = this.automaton_state.get();
        this.automaton_state.assertEquals(automaton_state);
        const memory = this.memory.get();
        this.memory.assertEquals(memory);
        // make sure this is the right contract by checking if
        // the caller is in possession of the correct preimage
        commitment.assertEquals(_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage.hash(contract_preimage));
        // make sure the caller is a party in the contract
        actor
            .equals(contract_preimage.arbiter)
            .or(actor.equals(contract_preimage.contractor))
            .or(actor.equals(contract_preimage.employer))
            .assertTrue();
        // check who has acted
        const actions = memory.toBits(3);
        const acted = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.employer), actions[2], snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.contractor), actions[1], snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.arbiter), actions[0], (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(false))));
        const has_not_acted = acted.not();
        // determine if it is allowed to withdraw at this stage
        const is_state_canceled_early = automaton_state.equals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_canceled_early));
        const is_state_canceled = automaton_state.equals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_canceled));
        const is_state_succeeded = automaton_state.equals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_succeeded));
        const is_state_failed = automaton_state.equals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_failed));
        const withdraw_allowed = is_state_canceled_early
            .and(acted)
            .or(is_state_canceled.and(has_not_acted))
            .or(is_state_succeeded.and(has_not_acted))
            .or(is_state_failed.and(has_not_acted));
        withdraw_allowed.assertTrue();
        // determine the amount of the withdrawal
        const current_outcome = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](is_state_canceled_early, contract_preimage.deposited, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](is_state_canceled, contract_preimage.cancel, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](is_state_succeeded, contract_preimage.success, contract_preimage.failure // only option left...
        )));
        const amount = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.employer), current_outcome.payment_employer, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.contractor), current_outcome.payment_contractor, current_outcome.payment_arbiter // only option left...
        ));
        // do the withdrawal
        this.send({ to: actor, amount: amount });
        // update the memory
        actions[2] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.employer), actions[2].not(), actions[2]);
        actions[1] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.contractor), actions[1].not(), actions[1]);
        actions[0] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](actor.equals(contract_preimage.arbiter), actions[0].not(), actions[0]);
        const new_memory = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field.fromBits */ .gN.fromBits(actions);
        this.memory.set(new_memory);
    }
    success(contract_preimage, actor_pk) {
        const commitment = this.commitment.get();
        this.commitment.assertEquals(commitment);
        const automaton_state = this.automaton_state.get();
        this.automaton_state.assertEquals(automaton_state);
        const blockchain_length = this.network.blockchainLength.get();
        this.network.blockchainLength.assertEquals(blockchain_length);
        // make sure this is the right contract by checking if
        // the caller is in possession of the correct preimage
        commitment.assertEquals(_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage.hash(contract_preimage));
        // check if the deposit deadline is respected
        blockchain_length.assertGte(contract_preimage.success.start_after);
        blockchain_length.assertLt(contract_preimage.success.finish_before);
        // make sure the caller is a party in the contract
        actor_pk
            .equals(contract_preimage.arbiter)
            .or(actor_pk.equals(contract_preimage.contractor))
            .or(actor_pk.equals(contract_preimage.employer))
            .assertTrue();
        // make sure that the caller is approving this method
        snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .AccountUpdate.create */ .nx.create(actor_pk).requireSignature();
        // state must be deposited
        automaton_state.assertEquals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_deposited));
        // ensure caller is the arbiter
        actor_pk.equals(contract_preimage.arbiter).assertTrue();
        // update the state to "succeeded"
        this.automaton_state.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_succeeded));
        // zero the memory for the withdrawals
        this.memory.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0));
    }
    failure(contract_preimage, actor_pk) {
        const commitment = this.commitment.get();
        this.commitment.assertEquals(commitment);
        const automaton_state = this.automaton_state.get();
        this.automaton_state.assertEquals(automaton_state);
        const blockchain_length = this.network.blockchainLength.get();
        this.network.blockchainLength.assertEquals(blockchain_length);
        // make sure this is the right contract by checking if
        // the caller is in possession of the correct preimage
        commitment.assertEquals(_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage.hash(contract_preimage));
        // check if the deposit deadline is respected
        blockchain_length.assertGte(contract_preimage.failure.start_after);
        blockchain_length.assertLt(contract_preimage.failure.finish_before);
        // make sure the caller is a party in the contract
        actor_pk
            .equals(contract_preimage.arbiter)
            .or(actor_pk.equals(contract_preimage.contractor))
            .or(actor_pk.equals(contract_preimage.employer))
            .assertTrue();
        // make sure that the caller is approving this method
        snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .AccountUpdate.create */ .nx.create(actor_pk).requireSignature();
        // state must be deposited
        automaton_state.assertEquals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_deposited));
        // ensure caller is the arbiter
        actor_pk.equals(contract_preimage.arbiter).assertTrue();
        // update the state to "canceled"
        this.automaton_state.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_failed));
        // zero the memory for the withdrawals
        this.memory.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0));
    }
    cancel(contract_preimage, actor_pk) {
        const commitment = this.commitment.get();
        this.commitment.assertEquals(commitment);
        const automaton_state = this.automaton_state.get();
        this.automaton_state.assertEquals(automaton_state);
        const memory = this.memory.get();
        this.memory.assertEquals(memory);
        const blockchain_length = this.network.blockchainLength.get();
        this.network.blockchainLength.assertEquals(blockchain_length);
        // make sure this is the right contract by checking if
        // the caller is in possession of the correct preimage
        commitment.assertEquals(_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage.hash(contract_preimage));
        // make sure the caller is a party in the contract
        actor_pk
            .equals(contract_preimage.arbiter)
            .or(actor_pk.equals(contract_preimage.contractor))
            .or(actor_pk.equals(contract_preimage.employer))
            .assertTrue();
        // make sure that the caller is approving this method
        snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .AccountUpdate.create */ .nx.create(actor_pk).requireSignature();
        // before deposit deadline anyone can cancel
        const is_in_deposit = contract_preimage.deposited.start_after
            .lte(blockchain_length)
            .and(contract_preimage.deposited.finish_before.gt(blockchain_length))
            .and(automaton_state.equals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_initial)));
        // after deposit deadline only the employee can cancel
        const is_within_deadline = contract_preimage.success.start_after
            .lte(blockchain_length)
            .and(contract_preimage.success.finish_before.gt(blockchain_length))
            .and(automaton_state.equals((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_deposited)));
        // as for the deadline, it has to be either initial (for everyone)
        // either deposited (for employee) in order to cancel
        is_in_deposit.or(is_within_deadline).assertTrue();
        // if it is after the initial stage, caller must be employee
        const is_caller_correct = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](is_within_deadline, actor_pk.equals(contract_preimage.employer), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(true));
        is_caller_correct.assertTrue();
        // update the state to "canceled" or "canceled early"
        const next_state = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](is_within_deadline, (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_canceled), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(state_canceled_early));
        this.automaton_state.set(next_state);
        // if canceled late then zero out the memory
        const next_memory = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](is_within_deadline, (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0), memory);
        this.memory.set(next_memory);
    }
}
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN),
    __metadata("design:type", Object)
], Mac.prototype, "commitment", void 0);
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN),
    __metadata("design:type", Object)
], Mac.prototype, "automaton_state", void 0);
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN),
    __metadata("design:type", Object)
], Mac.prototype, "memory", void 0);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN]),
    __metadata("design:returntype", void 0)
], Mac.prototype, "initialize", null);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh]),
    __metadata("design:returntype", void 0)
], Mac.prototype, "deposit", null);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh]),
    __metadata("design:returntype", void 0)
], Mac.prototype, "withdraw", null);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh]),
    __metadata("design:returntype", void 0)
], Mac.prototype, "success", null);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh]),
    __metadata("design:returntype", void 0)
], Mac.prototype, "failure", null);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_strpreim__WEBPACK_IMPORTED_MODULE_1__.Preimage, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh]),
    __metadata("design:returntype", void 0)
], Mac.prototype, "cancel", null);


/***/ }),

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