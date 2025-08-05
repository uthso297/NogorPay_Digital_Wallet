import { JwtPayload } from "jsonwebtoken"
import { ITransaction, TransactionStatus } from "./transaction.interface"
import { User } from "../user/user.moel"
import { Wallet } from "../wallet/wallet.model"
import { Transaction } from "./transaction.model"
import AppError from "../../errorHelper/AppError"
import mongoose from "mongoose"

const addMoney = async (body: Partial<ITransaction>, user: JwtPayload) => {

    const session = await mongoose.startSession()

    try {

        session.startTransaction()

        const { userId } = user
        const userInfo = await User.findById(userId).session(session)
        if (!userInfo || !userInfo.wallet) {
            throw new Error("User or wallet not found");
        }

        const { amount } = body
        if (!amount || amount <= 0) {
            throw new Error("Invalid amount");
        }

        const walletInfo = await Wallet.findById(userInfo.wallet).session(session)
        if (!walletInfo) {
            throw new Error("Wallet not found");
        }
        walletInfo.balance += amount;
        await walletInfo.save({ session })
        const transaction: Partial<ITransaction> = {
            type: body.type,
            amount,
            initiatorIdUser: userId,
            initiatorModel: 'User',
            status: TransactionStatus.COMPLETED
        }

        const result = await Transaction.create([transaction], { session })
        await session.commitTransaction();
        session.endSession();

        return result
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(404, 'Transaction failed')
    }
}


export const TransactionService = {
    addMoney
}