import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { JwtPayload } from "jsonwebtoken";

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

export const TransactionController = {
    addMoney
}