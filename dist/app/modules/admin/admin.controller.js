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
exports.AdminController = exports.suspendAgent = exports.approveAgent = exports.unblockWallet = exports.blockWallet = exports.getWallets = exports.getAgents = exports.getUsers = void 0;
const user_moel_1 = require("../user/user.moel");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const agent_model_1 = require("../agent/agent.model");
const wallet_model_1 = require("../wallet/wallet.model");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_moel_1.User.find({ email: { $ne: 'admin@admin.com' } }).select('-password');
        if (!users) {
            throw new AppError_1.default(401, 'No user found');
        }
        res.status(201).json({
            success: true,
            message: 'All users retrieved successfully',
            data: users
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getAgents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield agent_model_1.Agent.find({}).select('-password');
        if (!agents) {
            throw new AppError_1.default(401, 'No agent found');
        }
        res.status(201).json({
            success: true,
            message: 'All agents retrieved successfully',
            data: agents
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAgents = getAgents;
const getWallets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallets = yield wallet_model_1.Wallet.find({});
        if (!wallets) {
            throw new AppError_1.default(401, 'No wallet found');
        }
        res.status(201).json({
            success: true,
            message: 'All wallets retrieved successfully',
            data: wallets
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getWallets = getWallets;
const blockWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield wallet_model_1.Wallet.findById(req.params.id);
        if (!wallet) {
            throw new AppError_1.default(400, 'No wallet found');
        }
        const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(req.params.id, { isActive: 'BLOCKED' }, { new: true, runValidators: true });
        res.status(201).json({
            success: true,
            message: 'Wallet blocked successfully',
            data: updatedWallet
        });
    }
    catch (error) {
        next(error);
    }
});
exports.blockWallet = blockWallet;
const unblockWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield wallet_model_1.Wallet.findById(req.params.id);
        if (!wallet) {
            throw new AppError_1.default(400, 'No wallet found');
        }
        const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(req.params.id, { isActive: 'ACTIVE' }, { new: true, runValidators: true });
        res.status(201).json({
            success: true,
            message: 'Wallet unblocked successfully',
            data: updatedWallet
        });
    }
    catch (error) {
        next(error);
    }
});
exports.unblockWallet = unblockWallet;
const approveAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield agent_model_1.Agent.findById(req.params.id);
        if (!wallet) {
            throw new AppError_1.default(400, 'No agent found');
        }
        const updatedAgent = yield agent_model_1.Agent.findByIdAndUpdate(req.params.id, { isApproved: 'APPROVED' }, { new: true, runValidators: true });
        const updatedAgentObj = updatedAgent === null || updatedAgent === void 0 ? void 0 : updatedAgent.toObject();
        let rest;
        if (updatedAgentObj) {
            const { password } = updatedAgentObj, otherFields = __rest(updatedAgentObj, ["password"]);
            rest = otherFields;
        }
        else {
            rest = {};
        }
        res.status(201).json({
            success: true,
            message: 'Agent approved successfully',
            data: rest
        });
    }
    catch (error) {
        next(error);
    }
});
exports.approveAgent = approveAgent;
const suspendAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield agent_model_1.Agent.findById(req.params.id);
        if (!wallet) {
            throw new AppError_1.default(400, 'No agent found');
        }
        const updatedAgent = yield agent_model_1.Agent.findByIdAndUpdate(req.params.id, { isApproved: 'SUSPEND' }, { new: true, runValidators: true });
        const updatedAgentObj = updatedAgent === null || updatedAgent === void 0 ? void 0 : updatedAgent.toObject();
        let rest;
        if (updatedAgentObj) {
            const { password } = updatedAgentObj, otherFields = __rest(updatedAgentObj, ["password"]);
            rest = otherFields;
        }
        else {
            rest = {};
        }
        res.status(201).json({
            success: true,
            message: 'Agent suspended successfully',
            data: rest
        });
    }
    catch (error) {
        next(error);
    }
});
exports.suspendAgent = suspendAgent;
exports.AdminController = {
    getUsers: exports.getUsers,
    getAgents: exports.getAgents,
    getWallets: exports.getWallets,
    blockWallet: exports.blockWallet,
    unblockWallet: exports.unblockWallet,
    approveAgent: exports.approveAgent,
    suspendAgent: exports.suspendAgent
};
