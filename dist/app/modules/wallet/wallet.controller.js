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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyWallet = void 0;
const user_moel_1 = require("../user/user.moel");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const wallet_model_1 = require("./wallet.model");
const agent_model_1 = require("../agent/agent.model");
const getMyWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    let userInfo = yield user_moel_1.User.findById(userId);
    if (!userInfo) {
        userInfo = yield agent_model_1.Agent.findById(userId);
    }
    if (!userInfo) {
        throw new AppError_1.default(404, "User not found");
    }
    const walletInfo = yield wallet_model_1.Wallet.findById(userInfo.wallet);
    if (!walletInfo) {
        throw new AppError_1.default(404, "Wallet not found");
    }
    res.status(201).json({
        success: true,
        message: 'Your wallet retreived successfully',
        data: walletInfo
    });
});
exports.getMyWallet = getMyWallet;
