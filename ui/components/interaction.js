"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.finalizeContract = void 0;
var link_1 = require("next/link");
var AppContext_1 = require("./AppContext");
var highlights_1 = require("./highlights");
var txBuilding_1 = require("./txBuilding");
var ContractRendering_1 = require("./ContractRendering");
var multiwallet_1 = require("./multiwallet");
var snarkyjs_1 = require("snarkyjs");
function finalizeContract(context) {
    return __awaiter(this, void 0, void 0, function () {
        var macpack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // instantiate preimage via worker and compute macpack
                return [4 /*yield*/, context.state.zkappWorkerClient.definePreimage(context.state.zkappPublicKey.toBase58(), context.state.contract_employer.toBase58(), context.state.contract_contractor.toBase58(), context.state.contract_arbiter.toBase58(), context.state.contract_description, context.state.contract_outcome_deposit_description, Math.abs(context.state.contract_outcome_deposit_after), Math.abs(context.state.contract_outcome_deposit_before), Math.abs(context.state.contract_outcome_deposit_employer), Math.abs(context.state.contract_outcome_deposit_contractor), Math.abs(context.state.contract_outcome_deposit_arbiter), context.state.contract_outcome_success_description, Math.abs(context.state.contract_outcome_success_after), Math.abs(context.state.contract_outcome_success_before), Math.abs(context.state.contract_outcome_success_employer), Math.abs(context.state.contract_outcome_success_contractor), Math.abs(context.state.contract_outcome_success_arbiter), context.state.contract_outcome_failure_description, Math.abs(context.state.contract_outcome_failure_after), Math.abs(context.state.contract_outcome_failure_before), Math.abs(context.state.contract_outcome_failure_employer), Math.abs(context.state.contract_outcome_failure_contractor), Math.abs(context.state.contract_outcome_failure_arbiter), context.state.contract_outcome_cancel_description, Math.abs(context.state.contract_outcome_cancel_after), Math.abs(context.state.contract_outcome_cancel_before), Math.abs(context.state.contract_outcome_cancel_employer), Math.abs(context.state.contract_outcome_cancel_contractor), Math.abs(context.state.contract_outcome_cancel_arbiter))];
                case 1:
                    // instantiate preimage via worker and compute macpack
                    _a.sent();
                    return [4 /*yield*/, context.state.zkappWorkerClient.toMacPack()];
                case 2:
                    macpack = _a.sent();
                    context.setState(__assign(__assign({}, context.state), { loaded: true, macpack: macpack }));
                    return [2 /*return*/];
            }
        });
    });
}
exports.finalizeContract = finalizeContract;
function contractRefreshState(context) {
    return __awaiter(this, void 0, void 0, function () {
        var contract_state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.state.zkappWorkerClient.getContractState()];
                case 1:
                    contract_state = _a.sent();
                    context.setState(__assign(__assign({}, context.state), { employerActed: contract_state['acted']['employer'], contractorActed: contract_state['acted']['contractor'], arbiterActed: contract_state['acted']['arbiter'], automatonState: contract_state['automatonState'] }));
                    return [2 /*return*/];
            }
        });
    });
}
var DeployButton = function () {
    var context = (0, AppContext_1.castContext)();
    if (!context.state.deployed) {
        if ((context.state.tx_building_state != '') &&
            (context.state.tx_command != 'deploy')) {
            return (<button className="btn btn-disabled animate-pulse">Deploy</button>);
        }
        if ((context.state.tx_building_state != '') &&
            (context.state.tx_command == 'deploy')) {
            return (<button className="btn btn-primary btn-disabled animate-pulse">{context.state.tx_building_state}</button>);
        }
        return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, txBuilding_1.contractDeploy)(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }}>Deploy</button>);
    }
    return (<button className="btn btn-disabled">Deploy</button>);
};
var InitButton = function () {
    var context = (0, AppContext_1.castContext)();
    if (!context.state.deployed) {
        return (<button className="btn btn-disabled">Initialize</button>);
    }
    else if (context.state.tx_building_state == '') {
        return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, txBuilding_1.contractInit)(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }}>Initialize</button>);
    }
    else if ((context.state.tx_building_state != '') && (context.state.tx_command != 'init')) {
        return (<button className="btn btn-primary btn-disabled">Initialize</button>);
    }
    return (<button className="btn btn-disabled animate-pulse">{context.state.tx_building_state}</button>);
};
var DepositButton = function () {
    var context = (0, AppContext_1.castContext)();
    if ((context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
        if (context.state.tx_building_state == '') {
            return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, txBuilding_1.contractDeposit)(context)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }}>Deposit</button>);
        }
        else if ((context.state.tx_building_state != '') && (context.state.tx_command != 'deposit')) {
            return (<button className="btn btn-disabled">Deposit</button>);
        }
    }
    return (<button className="btn btn-disabled">Deposit</button>);
};
var WithdrawButton = function () {
    var context = (0, AppContext_1.castContext)();
    if ((context.connectedAddress === null) || (context.blockchainLength < context.state.contract_outcome_deposit_after)) {
        return (<button className="btn btn-disabled">Withdraw</button>);
    }
    return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractWithdraw)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>Withdraw</button>);
};
var SuccessButton = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.connectedAddress === null) {
        return (<button className="btn btn-primary btn-disabled">Judge success</button>);
    }
    var actor = snarkyjs_1.PublicKey.fromBase58(context.connectedAddress);
    if ((context.state.contract_outcome_success_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_success_before) &&
        (actor == context.state.contract_arbiter)) {
        return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, txBuilding_1.contractSuccess)(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }}>Judge success</button>);
    }
    return (<button className="btn btn-disabled">Judge success</button>);
};
var FailureButton = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.connectedAddress === null) {
        return (<button className="btn btn-primary btn-disabled">Judge failure</button>);
    }
    var actor = snarkyjs_1.PublicKey.fromBase58(context.connectedAddress);
    if ((context.state.contract_outcome_failure_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_failure_before) &&
        (actor == context.contract_arbiter)) {
        return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, txBuilding_1.contractFailure)(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }}>Judge failure</button>);
    }
    return (<button className="btn btn-disabled">Judge failure</button>);
};
var CancelButton = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.connectedAddress === null) {
        return (<button className="btn btn-disabled">Cancel for free</button>);
    }
    var actor = snarkyjs_1.PublicKey.fromBase58(context.connectedAddress);
    if ((context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
        return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, txBuilding_1.contractCancel)(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }}>Cancel for free</button>);
    }
    else if ((context.state.contract_outcome_cancel_after <= context.blockchainLength) &&
        (context.blockchainLength < context.state.contract_outcome_cancel_before) &&
        (actor == context.state.contract_contractor)) {
        return (<button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, txBuilding_1.contractCancel)(context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }}>Cancel for penalty</button>);
    }
    return (<button className="btn btn-disabled">Cancel for penalty</button>);
};
var GodMode = function () {
    var context = (0, AppContext_1.castContext)();
    return (<div>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractDeploy)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Deploy</button>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractInit)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Initialize</button>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractDeposit)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Deposit</button>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractWithdraw)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Withdraw</button>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractSuccess)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Judge success</button>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractFailure)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Judge failure</button>
    <button className="btn btn-primary" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, txBuilding_1.contractCancel)(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }}>God Mode Cancel for free</button>
  </div>);
};
var DeploymentInformation = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.deployed) {
        return (<p>The contract has been deployed.</p>);
    }
    else {
        return (<p>The contract is pending deployment.<DeployButton /></p>);
    }
};
var TxIds = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.txHash != '') {
        var url = "https://berkeley.minaexplorer.com/transaction/" + context.txHash;
        console.log(url);
        return (<div>Your last transaction is <a href={url} target="_blank" rel="noreferrer">{context.txHash}</a></div>);
    }
    return (<div></div>);
};
var ConnectedAccount = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.connectedAddress !== null) {
        var employer = context.state.contract_employer.toBase58();
        var contractor = context.state.contract_contractor.toBase58();
        var arbiter = context.state.contract_arbiter.toBase58();
        switch (context.connectedAddress) {
            case employer:
                return (<p>Interacting as <highlights_1.MinaValue>{context.connectedAddress}</highlights_1.MinaValue>. You take <strong>employer</strong> role in this contract.</p>);
                break;
            case contractor:
                return (<p>Interacting as <highlights_1.MinaValue>{context.connectedAddress}</highlights_1.MinaValue>. You take <strong>contractor</strong> role in this contract.</p>);
                break;
            case arbiter:
                return (<p>Interacting as <highlights_1.MinaValue>{context.connectedAddress}</highlights_1.MinaValue>. You take <strong>arbiter</strong> role in this contract.</p>);
                break;
            default:
                return (<p>Interacting as <highlights_1.MinaValue>{context.connectedAddress}</highlights_1.MinaValue>. You take no role in this contract.</p>);
                break;
        }
    }
    return (<p>Failed to fetch your account from Auro wallet...</p>);
};
var CancelTimeLine = function () {
    var context = (0, AppContext_1.castContext)();
    if ((context.state.contract_outcome_cancel_after <= context.blockchainLength) &&
        (context.state.blockchainLength < context.state.contract_outcome_cancel_before)) {
        return (<p>It is possible to <strong>cancel</strong> at the current stage with a financial penalty.</p>);
    }
    else if (context.blockchainLength < context.state.contract_outcome_cancel_before) {
        return (<p>The option to <strong>cancel</strong> with a financial penalty has not opened yet.</p>);
    }
    return (<p>The option to <strong>cancel</strong> with a financial penalty has already closed.</p>);
};
var ContractTimeline = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.state.blockchainLength !== null) {
        if (context.state.blockchainLength < context.state.contract_outcome_deposit_after) {
            return (<p>The contract is in the <strong>warm-up</strong> stage</p>);
        }
        else if ((context.state.contract_outcome_deposit_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_deposit_before)) {
            return (<p>The contract is in the <strong>deposit</strong> stage. It is possible to <strong>cancel</strong> for free with no consequences.</p>);
        }
        else if ((context.state.contract_outcome_success_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_success_before)) {
            return (<div><p>The contract is in the <strong>success declaration</strong> stage.</p><CancelTimeLine /></div>);
        }
        else if ((context.state.contract_outcome_failure_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_failure_before)) {
            return (<div><p>The contract is in the <strong>failure declaration</strong> stage.</p><CancelTimeLine /></div>);
        }
        else if ((context.state.contract_outcome_failure_after <= context.blockchainLength) &&
            (context.blockchainLength < context.state.contract_outcome_failure_before)) {
            return (<div><p>The contract is in the <strong>failure declaration</strong> stage.</p><CancelTimeLine /></div>);
        }
        else {
            return (<div><p>All the contract stages have expired.</p><CancelTimeLine /></div>);
        }
    }
    return (<p>Failed to fetch current blockchain length... It is not possible to establish in which stage current contract is.</p>);
};
var EmployerActed = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.state.employerActed) {
        return (<div>Employer has acted.</div>);
    }
    return (<div></div>);
};
var ContractorActed = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.state.contractorActed) {
        return (<div>Contractor has acted.</div>);
    }
    return (<div></div>);
};
var ArbiterActed = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.state.arbiterActed) {
        return (<div>Arbiter has acted.</div>);
    }
    return (<div></div>);
};
var WhoActed = function () {
    return (<div>
        <EmployerActed />
        <ContractorActed />
        <ArbiterActed />
    </div>);
};
var InteractionUI = function () {
    var context = (0, AppContext_1.castContext)();
    return (<div>
    <ConnectedAccount />
    <ContractTimeline />
    <WhoActed />
    <TxIds />
    <DeployButton />
    <InitButton />
    <DepositButton />
    <WithdrawButton />
    <SuccessButton />
    <FailureButton />
    <CancelButton />
  </div>);
};
var InteractionEditor = function () {
    var context = (0, AppContext_1.castContext)();
    if (!context.state.deployed) {
        if (context.compilationButtonState < 4) {
            return (<div>Your contract is finalized and is is already possible to <link_1["default"] href="/export">export</link_1["default"]> it using MacPacks. However, it is not available on-chain. Make sure you compile the zk-SNARK circuit first and then you may deploy it. Compilation will take between 7 and 20 minutes so make sure you have some nice show to watch in the meantime.</div>);
        }
        else {
            return (<div>
                    <h2>Interaction</h2>
                    <DeploymentInformation />
                </div>);
        }
    }
    return (<div>
            <h2>Interaction</h2>
            <DeploymentInformation />
            <InteractionUI />
        </div>);
};
var InteractionCases = function () {
    var context = (0, AppContext_1.castContext)();
    if (context.compilationButtonState < 2) {
        return (<div>Make sure you load the SnarkyJS library!</div>);
    }
    else if (context.connectionButtonState < 2) {
        return (<div>Make sure you connect your AuroWallet!</div>);
    }
    else if (!context.state.loaded) {
        return (<div>Now you may <link_1["default"] href="/create">create a new contract</link_1["default"]> or <link_1["default"] href="/import">import an existing contract</link_1["default"]>.</div>);
    }
    else {
        return (<div>
                <InteractionEditor />
                <ContractRendering_1.RenderContractDescription />
            </div>);
    }
};
var Interaction = function () {
    return (<article className="container prose">
            <h1>Interact with a <i>MAC!</i> contract</h1>
            <multiwallet_1.InteractionModeUI />
            <InteractionCases />
        </article>);
};
exports["default"] = Interaction;
