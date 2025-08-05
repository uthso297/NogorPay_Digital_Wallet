import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.moel";
import AppError from "../../errorHelper/AppError";
import { Wallet } from "./wallet.model";
import { Agent } from "../agent/agent.model";

export const getMyWallet = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload
    let userInfo = await User.findById(userId)
    if (!userInfo) {
        userInfo = await Agent.findById(userId)
    }
    if (!userInfo) {
        throw new AppError(404, "User not found");
    }
    const walletInfo = await Wallet.findById(userInfo.wallet)
    if (!walletInfo) {
        throw new AppError(404, "Wallet not found");
    }

    res.status(201).json({
        success: true,
        message: 'Your wallet retreived successfully',
        data: walletInfo
    })
}
