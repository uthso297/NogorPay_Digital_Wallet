import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes'
import passport from "passport";
import AppError from "../../errorHelper/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { UserService } from "../user/user.service";
import { AuthServices } from "./auth.service";
const credentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const loginInfo = await AuthServices.credentialsLogin(req.body)
        passport.authenticate('local', async (err: any, user: any, info: any) => {
            if (err) {
                return next(new AppError(401, err))
            }
            if (!user) {
                return next(new AppError(401, info.message))

            }

            const userToken = createUserTokens(user)

            res.cookie('accessToken', userToken, {
                httpOnly: true,
                secure: false
            })

            res.status(httpStatus.OK).json({
                success: true,
                message: 'User logged in successfully',
                userToken
            })
        })(req, res, next);

    } catch (error) {
        next(error)
    }
}

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user as JwtPayload
        const result = await AuthServices.getMe(decodedToken.userId)
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Your profile retrived successfuly',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false
    })
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out Successfully",
    })
}

export const AuthController = {
    credentialsLogin,
    getMe,
    logout
}