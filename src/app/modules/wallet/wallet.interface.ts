import { Types } from "mongoose";
import { IsActive } from "../user/user.interface";

export enum WalletType {
    USER = "USER",
    AGENT = "AGENT",
}



export interface IWallet {
    _id?: Types.ObjectId;
    ownerId: Types.ObjectId;
    ownerModel: "User" | "Agent"; 
    balance: number;
    type: WalletType;
    isActive: IsActive;
    createdAt?: Date;
    updatedAt?: Date;
}
