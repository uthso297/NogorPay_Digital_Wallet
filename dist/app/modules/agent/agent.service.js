"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const agent_model_1 = require("./agent.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../user/user.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const wallet_interface_1 = require("../wallet/wallet.interface");
const createAgent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const isUserExist = yield agent_model_1.Agent.findOne({ email });
        if (isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Agent already exist');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = { provider: "credentials", providerId: email };
        const createdUser = yield agent_model_1.Agent.create([Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest)], { session });
        const wallet = yield wallet_model_1.Wallet.create([
            {
                ownerId: createdUser[0]._id,
                ownerModel: "Agent",
                balance: 50,
                type: wallet_interface_1.WalletType.AGENT,
                isActive: user_interface_1.IsActive.ACTIVE,
            },
        ], { session });
        const updatedUser = yield agent_model_1.Agent.findByIdAndUpdate(createdUser[0]._id, { wallet: wallet[0]._id }, { new: true, runValidators: true, session })
            .populate('wallet', "balance type");
        yield session.commitTransaction();
        session.endSession();
        return updatedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.AgentService = {
    createAgent
};
