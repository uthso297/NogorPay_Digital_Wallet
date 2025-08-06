import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "./transaction.model";

const addMoney = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const result = await TransactionService.addMoney(req.body, req.user as JwtPayload)

        res.status(201).json({
            success: true,
            meassage: 'Add money successfull',
            data: result
        })
    } catch (error) {
        next(error)
    }

}

const getUserTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user as JwtPayload
        const transactions = await Transaction.find({
            $or: [
                { initiatorIdUser: userId },

                { $and: [{ senderId: userId }, { type: 'SEND' }] },

                { $and: [{ receiverId: userId }, { type: 'RECEIVE' }] },
            ],
        }).sort({ timestamp: -1 });
        res.status(200).json({
            data: transactions
        })
    } catch (error) {
        next(error)
    }
}

const withdrawMoney = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TransactionService.withdrawMoney(req.body, req.user as JwtPayload);
        res.status(201).json({
            success: true,
            meassage: 'Withdraw money successfull',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const sendMoney = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user as JwtPayload
        const response = await TransactionService.sendMoney(userId, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const cashIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user as JwtPayload
        const response = await TransactionService.cashIn(userId, req.body)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


export const TransactionController = {
    addMoney,
    getUserTransaction,
    withdrawMoney,
    sendMoney,
    cashIn
}