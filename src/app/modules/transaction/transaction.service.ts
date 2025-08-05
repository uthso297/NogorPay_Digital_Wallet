import { JwtPayload } from "jsonwebtoken"
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface"
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

const withdrawMoney = async (body: Partial<ITransaction>, user: JwtPayload) => {
    const session = await mongoose.startSession()

    try {

        session.startTransaction()

        const { userId } = user
        const userInfo = await User.findById(userId).session(session)
        if (!userInfo || !userInfo.wallet) {
            throw new AppError(404, "User or wallet not found");
        }

        const { amount } = body
        if (!amount || amount <= 0) {
            throw new AppError(404, "Invalid amount");
        }

        const walletInfo = await Wallet.findById(userInfo.wallet).session(session)
        if (!walletInfo) {
            throw new AppError(404, "Wallet not found");
        }
        if (walletInfo.balance < amount) {
            throw new AppError(404, "Insufficient amount");
        }
        walletInfo.balance -= amount;
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

const sendMoney = async (userId: string, payload: { type: TransactionType, amount: number; receiverEmail: string }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = await User.findById(userId).session(session);
        if (!sender) {
            throw new AppError(404, "Sender not found");
        }
        const senderWallet = await Wallet.findById(sender.wallet).session(session)
        if (!senderWallet) {
            throw new AppError(404, "Sender wallet not available");
        }

        const receiver = await User.findOne({ email: payload.receiverEmail }).populate("wallet").session(session);
        if (!receiver) {
            throw new AppError(404, "Receiver not found");
        }
        const receiverWallet = await Wallet.findById(receiver.wallet).session(session)
        if (!receiverWallet) {
            throw new AppError(404, "Receiver wallet not available");
        }

        if (senderWallet.balance < payload.amount) {
            throw new AppError(400, "Insufficient balance");
        }

        senderWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        await Transaction.create(
            [
                {
                    type: TransactionType.SEND,
                    amount: payload.amount,
                    initiatorModel: "User",
                    senderId: sender._id,
                    receiverId: receiver._id,
                    status: TransactionStatus.COMPLETED,
                },
            ],
            { session }
        );

        await Transaction.create(
            [
                {
                    type: TransactionType.RECEIVE,
                    amount: payload.amount,
                    initiatorModel: "User",
                    senderId: sender._id,
                    receiverId: receiver._id,
                    status: TransactionStatus.COMPLETED,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Money sent successfully" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};



export const TransactionService = {
    addMoney,
    withdrawMoney,
    sendMoney
}