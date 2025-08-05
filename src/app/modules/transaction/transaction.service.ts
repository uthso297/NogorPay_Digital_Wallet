import { JwtPayload } from "jsonwebtoken"
import { ITransaction } from "./transaction.interface"
import { User } from "../user/user.moel"
import { Wallet } from "../wallet/wallet.model"

const addMoney = async (body: Partial<ITransaction>, user: JwtPayload) => {
    const { userId } = user
    const userInfo = await User.findById(userId)
    if (!userInfo || !userInfo.wallet) {
        throw new Error("User or wallet not found");
    }

    const { amount } = body
    if (!amount || amount <= 0) {
        throw new Error("Invalid amount");
    }

    const walletInfo = await Wallet.findById(userInfo.wallet)
    if (!walletInfo) {
        throw new Error("Wallet not found");
    }
    walletInfo.balance += amount;
    await walletInfo.save()
    const updatedBalance = await Wallet.findById(userInfo.wallet).select('balance -_id')

    return updatedBalance
}


export const TransactionService = {
    addMoney
}