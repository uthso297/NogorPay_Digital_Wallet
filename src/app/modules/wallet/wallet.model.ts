import { model, Schema } from "mongoose";
import { IWallet, WalletType } from "./wallet.interface";
import { IsActive } from "../user/user.interface";


const walletSchema = new Schema<IWallet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ownerModel: {
      type: String,
      enum: ["User", "Agent"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 50,
    },
    type: {
      type: String,
      enum: Object.values(WalletType),
      required: true,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);


export const Wallet = model<IWallet>("Wallet", walletSchema);
