"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(transaction_interface_1.TransactionType), required: true },
    amount: { type: Number, required: true },
    initiatorIdUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    initiatorIdAgent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Agent" },
    initiatorModel: { type: String, required: true, enum: ["User", "Agent"] },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    comission: { type: Number },
    status: { type: String, enum: Object.values(transaction_interface_1.TransactionStatus), default: transaction_interface_1.TransactionStatus.COMPLETED },
    timestamp: { type: Date, default: Date.now }
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
