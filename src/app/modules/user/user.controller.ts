import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from 'http-status-codes'
import AppError from "../../errorHelper/AppError";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await UserService.createUser(req.body)

        if (!user) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed')
        }

        const userObj = user.toObject();
        const { _id, password, ...rest } = userObj

        res.status(httpStatus.CREATED).json({
            message: 'User created successfully',
            data: rest
        })

    } catch (error) {
        next(error)
    }

}

export const UserController = {
    createUser
}