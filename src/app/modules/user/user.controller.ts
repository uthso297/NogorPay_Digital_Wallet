import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from 'http-status-codes'
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await UserService.createUser(req.body)

        // const userObj = user.toObject();
        // const { _id, password, ...rest } = userObj

        res.status(httpStatus.CREATED).json({
            message: 'User created successfully',
            data: user
        })

    } catch (error) {
        console.log(error);
        next(error)
    }

}

export const UserController = {
    createUser
}