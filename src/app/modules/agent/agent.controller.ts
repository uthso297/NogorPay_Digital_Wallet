import { NextFunction, Request, Response } from "express";
import AppError from "../../errorHelper/AppError";
import httpStatus from 'http-status-codes'
import { AgentService } from "./agent.service";

const createAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agent = await AgentService.createAgent(req.body)

        if (!agent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Agent creation failed')
        }

        const agentObj = agent.toObject();
        const { _id, password, ...rest } = agentObj

        res.status(httpStatus.CREATED).json({
            message: 'Agent created successfully',
            data: rest
        })

    } catch (error) {
        next(error)
    }

}

export const AgentController = {
    createAgent
}