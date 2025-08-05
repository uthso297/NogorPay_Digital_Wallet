import { Types } from "mongoose";

export enum TransactionType {
    ADD_MONEY = "ADD_MONEY",
    WITHDRAW = "WITHDRAW",
    SEND = "SEND",
    CASH_IN = "CASH_IN",
    CASH_OUT = "CASH_OUT"
}

export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    REVERSED = "REVERSED"
}

export interface ITransaction {
    type: TransactionType;
    amount: number;
    initiatorIdUser?: Types.ObjectId;
    initiatorIdAgent?: Types.ObjectId;
    initiatorModel: "User" | "Agent";
    senderWallet?: Types.ObjectId;
    receiverWallet?: Types.ObjectId;
    status: TransactionStatus;
    timestamp: Date;
}
