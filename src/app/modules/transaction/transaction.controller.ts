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
        const wallets = await Transaction.find({ initiatorIdUser: userId })
        res.status(200).json({
            data: wallets
        })
    } catch (error) {
        next(error)
    }
}

export const TransactionController = {
    addMoney,
    getUserTransaction
}