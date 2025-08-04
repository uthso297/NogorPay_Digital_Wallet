import { NextFunction, Request, Response } from "express";
// import { AuthServices } from "./auth.service";
import httpStatus from 'http-status-codes'
import passport from "passport";
import AppError from "../../errorHelper/AppError";
import { createUserTokens } from "../../utils/userTokens";
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
            })
        })(req, res, next);

    } catch (error) {
        next(error)
    }
}

export const AuthController = {
    credentialsLogin
}