import { NextFunction, Request, Response } from "express";
import { User } from "../user/user.moel";
import AppError from "../../errorHelper/AppError";
import { Agent } from "../agent/agent.model";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}).select('-password')
        if (!users) {
            throw new AppError(401, 'No users found')
        }
        res.status(201).json({
            success: true,
            message: 'All users retrieved successfully',
            data: users
        })
    } catch (error) {
        next(error)
    }
}

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await Agent.find({}).select('-password')
        if (!users) {
            throw new AppError(401, 'No agents found')
        }
        res.status(201).json({
            success: true,
            message: 'All agents retrieved successfully',
            data: users
        })
    } catch (error) {
        next(error)
    }
}


export const AdminController = {
    getUsers,
    getAgents
}