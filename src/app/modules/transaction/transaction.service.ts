import { JwtPayload } from "jsonwebtoken"
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface"
import { User } from "../user/user.moel"
import { Wallet } from "../wallet/wallet.model"
import { Transaction } from "./transaction.model"
import AppError from "../../errorHelper/AppError"
import mongoose from "mongoose"
import { Agent } from "../agent/agent.model"

const addMoney = async (body: Partial<ITransaction>, user: JwtPayload) => {

    const session = await mongoose.startSession()

    try {

        session.startTransaction()

        const { userId } = user
        const userInfo = await User.findById(userId).session(session)
        if (!userInfo) {
            throw new AppError(404, "User not found");
        }

        const { amount } = body
        if (!amount || amount <= 0) {
            throw new AppError(404, "Invalid amount");
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

        const receiver = await User.findOne({ email: payload.receiverEmail }).session(session);
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

        const result = await Transaction.create(
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

        return { success: true, message: "Money sent successfully", result };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cashIn = async (userId: string, payload: { type: TransactionType, amount: number; receiverEmail: string }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = await Agent.findById(userId).session(session);
        if (!sender) {
            throw new AppError(404, "Sender not found");
        }
        if (sender.isApproved === 'NOT_APPROVED') {
            throw new AppError(404, "Sorry your account is not approved yet for transaction..Wait untill admin approve your account!")
        }
        if (sender.isApproved === 'SUSPEND') {
            throw new AppError(404, "Sorry your account is suspended.Contact with admin for more details!")
        }
        const senderWallet = await Wallet.findById(sender.wallet).session(session)
        if (!senderWallet) {
            throw new AppError(404, "Sender wallet not available");
        }

        if (senderWallet.isActive === 'INACTIVE') {
            throw new AppError(404, "Sorry your wallet is inactive")
        }

        if (senderWallet.isActive === 'BLOCKED') {
            throw new AppError(404, "Sorry your wallet is blocked..cantact with admin for more details")
        }

        const receiver = await User.findOne({ email: payload.receiverEmail }).session(session);
        if (!receiver) {
            throw new AppError(404, "Receiver not found");
        }
        if (receiver.status === 'INACTIVE') {
            throw new AppError(404, "Sorry receiver account is inactive")
        }

        if (receiver.status === 'BLOCKED') {
            throw new AppError(404, "Sorry receiver is blocked")
        }
        const receiverWallet = await Wallet.findById(receiver.wallet).session(session)
        if (!receiverWallet) {
            throw new AppError(404, "Receiver wallet not available");
        }

        if (receiverWallet.isActive === 'INACTIVE') {
            throw new AppError(404, "Sorry your account is inactive")
        }

        if (receiverWallet.isActive === 'BLOCKED') {
            throw new AppError(404, "Sorry your account is blocked..cantact with admin for more details")
        }

        if (senderWallet.balance < payload.amount) {
            throw new AppError(400, "Insufficient balance");
        }

        senderWallet.balance -= payload.amount;
        receiverWallet.balance += payload.amount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        const result = await Transaction.create(
            [
                {
                    type: TransactionType.CASH_IN,
                    amount: payload.amount,
                    initiatorModel: "Agent",
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

        return { success: true, message: "Cash In successfull", result };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}



export const TransactionService = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn
}