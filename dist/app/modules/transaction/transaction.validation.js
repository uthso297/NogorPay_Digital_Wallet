"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashOutZodSchema = exports.cashInZodSchema = exports.sendMoneyZodSchema = exports.withdrawZodSchema = exports.addMoneyZodSchema = void 0;
const zod_1 = require("zod");
const transaction_interface_1 = require("./transaction.interface");
const baseTransactionSchema = zod_1.z.object({
    type: zod_1.z.enum(transaction_interface_1.TransactionType),
    amount: zod_1.z
        .number({ error: "Amount must be a number" })
        .positive("Amount must be greater than zero"),
});
exports.addMoneyZodSchema = baseTransactionSchema.extend({
    type: zod_1.z.literal(transaction_interface_1.TransactionType.ADD_MONEY),
});
exports.withdrawZodSchema = baseTransactionSchema.extend({
    type: zod_1.z.literal(transaction_interface_1.TransactionType.WITHDRAW),
});
exports.sendMoneyZodSchema = baseTransactionSchema.extend({
    type: zod_1.z.literal(transaction_interface_1.TransactionType.SEND),
    receiverEmail: zod_1.z
        .string({ error: "Receiver email is required" })
});
exports.cashInZodSchema = baseTransactionSchema.extend({
    type: zod_1.z.literal(transaction_interface_1.TransactionType.CASH_IN),
    receiverEmail: zod_1.z
        .string({ error: "Receiver email is required" })
});
exports.cashOutZodSchema = baseTransactionSchema.extend({
    type: zod_1.z.literal(transaction_interface_1.TransactionType.CASH_OUT),
    senderEmail: zod_1.z
        .string({ error: "Receiver email is required" })
});
