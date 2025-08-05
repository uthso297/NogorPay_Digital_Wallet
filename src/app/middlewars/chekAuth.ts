import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.moel";
import httpStatus from 'http-status-codes'
import { JwtPayload } from "jsonwebtoken";
import { Agent } from "../modules/agent/agent.model";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(404, 'Token not found!!!!')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_SECRET) as JwtPayload
        let isUserExist = await User.findOne({ email: verifiedToken.email })
        if (!authRoles.includes(verifiedToken.role)) {

            throw new AppError(404, 'You are not permitted in this route')
        }

        if (!isUserExist) {
            isUserExist = await Agent.findOne({ email: verifiedToken.email })
        }
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User doesn't Exist")
        }

        req.user = verifiedToken
        next()

    } catch (error) {
        next(error)
    }
}