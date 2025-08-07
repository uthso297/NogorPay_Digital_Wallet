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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const transaction_model_1 = require("./transaction.model");
const addMoney = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_service_1.TransactionService.addMoney(req.body, req.user);
        res.status(201).json({
            success: true,
            meassage: 'Add money successfull',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const getUserTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const transactions = yield transaction_model_1.Transaction.find({
            $or: [
                { initiatorIdUser: userId },
                { $and: [{ senderId: userId }, { type: 'SEND' }] },
                { $and: [{ receiverId: userId }, { type: 'RECEIVE' }] },
            ],
        }).sort({ timestamp: -1 });
        res.status(200).json({
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
});
const getAgentTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const transactions = yield transaction_model_1.Transaction.find({
            $or: [
                { $and: [{ senderId: userId }, { type: 'CASH_IN' }] },
                { $and: [{ receiverId: userId }, { type: 'CASH_OUT' }] },
            ],
        }).sort({ timestamp: -1 });
        res.status(200).json({
            data: transactions
        });
    }
    catch (error) {
        next(error);
    }
});
const withdrawMoney = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_service_1.TransactionService.withdrawMoney(req.body, req.user);
        res.status(201).json({
            success: true,
            meassage: 'Withdraw money successfull',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const sendMoney = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const response = yield transaction_service_1.TransactionService.sendMoney(userId, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
const cashIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const response = yield transaction_service_1.TransactionService.cashIn(userId, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
const cashOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const response = yield transaction_service_1.TransactionService.cashOut(userId, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.TransactionController = {
    addMoney,
    getUserTransaction,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    getAgentTransaction
};
