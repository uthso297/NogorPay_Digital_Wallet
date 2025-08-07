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
exports.TransactionService = void 0;
const transaction_interface_1 = require("./transaction.interface");
const user_moel_1 = require("../user/user.moel");
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("./transaction.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const agent_model_1 = require("../agent/agent.model");
const addMoney = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { userId } = user;
        const userInfo = yield user_moel_1.User.findById(userId).session(session);
        if (!userInfo) {
            throw new AppError_1.default(404, "User not found");
        }
        if (userInfo.status === 'INACTIVE') {
            throw new AppError_1.default(404, "Your account is inactive...please contact with admin");
        }
        if (userInfo.status === 'BLOCKED') {
            throw new AppError_1.default(404, "Your account is blocked...please contact with admin");
        }
        const { amount } = body;
        if (!amount || amount <= 0) {
            throw new AppError_1.default(404, "Invalid amount");
        }
        const walletInfo = yield wallet_model_1.Wallet.findById(userInfo.wallet).session(session);
        if (!walletInfo) {
            throw new Error("Wallet not found");
        }
        if (walletInfo.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry your wallet is inactive");
        }
        if (walletInfo.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry your wallet is blocked..cantact with admin for more details");
        }
        walletInfo.balance += amount;
        yield walletInfo.save({ session });
        const transaction = {
            type: body.type,
            amount,
            initiatorIdUser: userId,
            initiatorModel: 'User',
            status: transaction_interface_1.TransactionStatus.COMPLETED
        };
        const result = yield transaction_model_1.Transaction.create([transaction], { session });
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(404, 'Transaction failed');
    }
});
const withdrawMoney = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { userId } = user;
        const userInfo = yield user_moel_1.User.findById(userId).session(session);
        if (!userInfo || !userInfo.wallet) {
            throw new AppError_1.default(404, "User or wallet not found");
        }
        if (userInfo.status === 'INACTIVE') {
            throw new AppError_1.default(404, "Your account is inactive...please contact with admin");
        }
        if (userInfo.status === 'BLOCKED') {
            throw new AppError_1.default(404, "Your account is blocked...please contact with admin");
        }
        const { amount } = body;
        if (!amount || amount <= 0) {
            throw new AppError_1.default(404, "Invalid amount");
        }
        const walletInfo = yield wallet_model_1.Wallet.findById(userInfo.wallet).session(session);
        if (!walletInfo) {
            throw new AppError_1.default(404, "Wallet not found");
        }
        if (walletInfo.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry your wallet is inactive");
        }
        if (walletInfo.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry your wallet is blocked..cantact with admin for more details");
        }
        if (walletInfo.balance < amount) {
            throw new AppError_1.default(404, "Insufficient amount");
        }
        walletInfo.balance -= amount;
        yield walletInfo.save({ session });
        const transaction = {
            type: body.type,
            amount,
            initiatorIdUser: userId,
            initiatorModel: 'User',
            status: transaction_interface_1.TransactionStatus.COMPLETED
        };
        const result = yield transaction_model_1.Transaction.create([transaction], { session });
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(404, 'Transaction failed');
    }
});
const sendMoney = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const sender = yield user_moel_1.User.findById(userId).session(session);
        if (!sender) {
            throw new AppError_1.default(404, "Sender not found");
        }
        if (sender.status === 'INACTIVE') {
            throw new AppError_1.default(404, "Your account is inactive...please contact with admin");
        }
        if (sender.status === 'BLOCKED') {
            throw new AppError_1.default(404, "Your account is blocked...please contact with admin");
        }
        const senderWallet = yield wallet_model_1.Wallet.findById(sender.wallet).session(session);
        if (!senderWallet) {
            throw new AppError_1.default(404, "Sender wallet not available");
        }
        if (senderWallet.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry your wallet is inactive");
        }
        if (senderWallet.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry your wallet is blocked..cantact with admin for more details");
        }
        const receiver = yield user_moel_1.User.findOne({ email: payload.receiverEmail }).session(session);
        if (!receiver) {
            throw new AppError_1.default(404, "Receiver not found");
        }
        if (receiver.status === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry receiver account is inactive");
        }
        if (receiver.status === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry receiver account is blocked");
        }
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiver.wallet).session(session);
        if (!receiverWallet) {
            throw new AppError_1.default(404, "Receiver wallet not available");
        }
        if (receiverWallet.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry your wallet is inactive");
        }
        if (receiverWallet.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry your wallet is blocked..cantact with admin for more details");
        }
        if (senderWallet.balance < payload.amount) {
            throw new AppError_1.default(400, "Insufficient balance");
        }
        senderWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        const result = yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.SEND,
                amount: payload.amount,
                initiatorModel: "User",
                senderId: sender._id,
                receiverId: receiver._id,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.RECEIVE,
                amount: payload.amount,
                initiatorModel: "User",
                senderId: sender._id,
                receiverId: receiver._id,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Money sent successfully", result };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashIn = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const sender = yield agent_model_1.Agent.findById(userId).session(session);
        if (!sender) {
            throw new AppError_1.default(404, "Agent not found");
        }
        if (sender.isApproved === 'NOT_APPROVED') {
            throw new AppError_1.default(404, "Sorry your account is not approved yet for transaction..Wait untill admin approve your account!");
        }
        if (sender.isApproved === 'SUSPEND') {
            throw new AppError_1.default(404, "Sorry your account is suspended.Contact with admin for more details!");
        }
        const senderWallet = yield wallet_model_1.Wallet.findById(sender.wallet).session(session);
        if (!senderWallet) {
            throw new AppError_1.default(404, "Your wallet not available");
        }
        if (senderWallet.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry your wallet is inactive");
        }
        if (senderWallet.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry your wallet is blocked..cantact with admin for more details");
        }
        const receiver = yield user_moel_1.User.findOne({ email: payload.receiverEmail }).session(session);
        if (!receiver) {
            throw new AppError_1.default(404, "Receiver not found");
        }
        if (receiver.status === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry receiver account is inactive");
        }
        if (receiver.status === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry receiver is blocked");
        }
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiver.wallet).session(session);
        if (!receiverWallet) {
            throw new AppError_1.default(404, "Receiver wallet not available");
        }
        if (receiverWallet.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry receiver wallet is inactive");
        }
        if (receiverWallet.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry receiver wallet is blocked..cantact with admin for more details");
        }
        if (senderWallet.balance < payload.amount) {
            throw new AppError_1.default(400, "Insufficient balance");
        }
        const comission = (payload.amount / 1000) * ((_a = sender.commissionRate) !== null && _a !== void 0 ? _a : 0);
        senderWallet.balance -= payload.amount;
        senderWallet.balance += comission;
        receiverWallet.balance += payload.amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        const result = yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.CASH_IN,
                amount: payload.amount,
                initiatorModel: "Agent",
                senderId: sender._id,
                receiverId: receiver._id,
                comission: comission,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.RECEIVE,
                amount: payload.amount,
                initiatorModel: "User",
                senderId: sender._id,
                receiverId: receiver._id,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Cash In successfull", result };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashOut = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const receiverAgent = yield agent_model_1.Agent.findById(userId).session(session);
        if (!receiverAgent) {
            throw new AppError_1.default(404, "Agent not found");
        }
        if (receiverAgent.isApproved === 'NOT_APPROVED') {
            throw new AppError_1.default(404, "Sorry your account is not approved yet for transaction..Wait untill admin approve your account!");
        }
        if (receiverAgent.isApproved === 'SUSPEND') {
            throw new AppError_1.default(404, "Sorry your account is suspended.Contact with admin for more details!");
        }
        const receiverAgentWalllet = yield wallet_model_1.Wallet.findById(receiverAgent.wallet).session(session);
        if (!receiverAgentWalllet) {
            throw new AppError_1.default(404, "Your wallet is not available");
        }
        if (receiverAgentWalllet.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry your wallet is inactive");
        }
        if (receiverAgentWalllet.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry your wallet is blocked..cantact with admin for more details");
        }
        const senderUser = yield user_moel_1.User.findOne({ email: payload.senderEmail }).session(session);
        if (!senderUser) {
            throw new AppError_1.default(404, "Sender not found");
        }
        if (senderUser.status === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry Sender account is inactive");
        }
        if (senderUser.status === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry Sender is blocked");
        }
        const senderUserWallet = yield wallet_model_1.Wallet.findById(senderUser.wallet).session(session);
        if (!senderUserWallet) {
            throw new AppError_1.default(404, "Sender wallet not available");
        }
        if (senderUserWallet.isActive === 'INACTIVE') {
            throw new AppError_1.default(404, "Sorry Sender wallet is inactive");
        }
        if (senderUserWallet.isActive === 'BLOCKED') {
            throw new AppError_1.default(404, "Sorry Sender wallet is blocked..cantact with admin for more details");
        }
        if (senderUserWallet.balance < payload.amount) {
            throw new AppError_1.default(400, "Insufficient balance");
        }
        const comission = (payload.amount / 1000) * ((_a = receiverAgent.commissionRate) !== null && _a !== void 0 ? _a : 0);
        receiverAgentWalllet.balance += payload.amount;
        receiverAgentWalllet.balance += comission;
        senderUserWallet.balance -= payload.amount;
        yield receiverAgentWalllet.save({ session });
        yield senderUserWallet.save({ session });
        const result = yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.CASH_OUT,
                amount: payload.amount,
                initiatorModel: "Agent",
                senderId: senderUser._id,
                receiverId: receiverAgent._id,
                comission: comission,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.SEND,
                amount: payload.amount,
                initiatorModel: "User",
                senderId: senderUser._id,
                receiverId: receiverAgent._id,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Cash Out successfull", result };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.TransactionService = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut
};
