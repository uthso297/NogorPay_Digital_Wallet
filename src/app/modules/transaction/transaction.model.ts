import { Schema, model } from "mongoose";
import { ITransaction, TransactionType, TransactionStatus } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
  type: { type: String, enum: Object.values(TransactionType), required: true },
  amount: { type: Number, required: true },
  // initiatorId: { type: Schema.Types.ObjectId, required: true, refPath: "initiatorModel" },
  // initiatorModel: { type: String, required: true, enum: ["User", "Agent"] },
  senderWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
  receiverWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
  status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.COMPLETED },
  timestamp: { type: Date, default: Date.now }
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
