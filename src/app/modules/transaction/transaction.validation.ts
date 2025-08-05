import { z } from "zod";
import { TransactionType } from "./transaction.interface";


const baseTransactionSchema = z.object({
    type: z.enum(TransactionType),
    amount: z
        .number({ error: "Amount must be a number" })
        .positive("Amount must be greater than zero"),
});


export const addMoneyZodSchema = baseTransactionSchema.extend({
    type: z.literal(TransactionType.ADD_MONEY),
});


export const withdrawZodSchema = baseTransactionSchema.extend({
    type: z.literal(TransactionType.WITHDRAW),
});


export const sendMoneyZodSchema = baseTransactionSchema.extend({
    type: z.literal(TransactionType.SEND),
    receiverWallet: z.string({ error: "Receiver wallet ID is required" }),
});


export const cashInZodSchema = baseTransactionSchema.extend({
    type: z.literal(TransactionType.CASH_IN),
    receiverWallet: z.string({ error: "Receiver wallet ID is required" }),
});

export const cashOutZodSchema = baseTransactionSchema.extend({
    type: z.literal(TransactionType.CASH_OUT),
    senderWallet: z.string({ error: "Sender wallet ID is required" }),
});
