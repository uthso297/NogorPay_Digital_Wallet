import { NextFunction, Request, Response } from "express";
import { User } from "../user/user.moel";
import AppError from "../../errorHelper/AppError";
import { Agent } from "../agent/agent.model";
import { Wallet } from "../wallet/wallet.model";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}).select('-password')
        if (!users) {
            throw new AppError(401, 'No user found')
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
        const agents = await Agent.find({}).select('-password')
        if (!agents) {
            throw new AppError(401, 'No agent found')
        }
        res.status(201).json({
            success: true,
            message: 'All agents retrieved successfully',
            data: agents
        })
    } catch (error) {
        next(error)
    }
}

export const getWallets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wallets = await Wallet.find({})
        if (!wallets) {
            throw new AppError(401, 'No wallet found')
        }
        res.status(201).json({
            success: true,
            message: 'All wallets retrieved successfully',
            data: wallets
        })
    } catch (error) {
        next(error)
    }
}

export const blockWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wallet = await Wallet.findById(req.params.id)
        if (!wallet) {
            throw new AppError(400, 'No wallet found')
        }
        const updatedWallet = await Wallet.findByIdAndUpdate(req.params.id, { isActive: 'BLOCKED' }, { new: true, runValidators: true })
        res.status(201).json({
            success: true,
            message: 'Wallet blocked successfully',
            data: updatedWallet
        })
    } catch (error) {
        next(error)
    }
}

export const unblockWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wallet = await Wallet.findById(req.params.id)
        if (!wallet) {
            throw new AppError(400, 'No wallet found')
        }
        const updatedWallet = await Wallet.findByIdAndUpdate(req.params.id, { isActive: 'ACTIVE' }, { new: true, runValidators: true })
        res.status(201).json({
            success: true,
            message: 'Wallet unblocked successfully',
            data: updatedWallet
        })
    } catch (error) {
        next(error)
    }
}

export const approveAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wallet = await Agent.findById(req.params.id)
        if (!wallet) {
            throw new AppError(400, 'No agent found')
        }
        const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, { isApproved: 'APPROVED' }, { new: true, runValidators: true })
        const updatedAgentObj = updatedAgent?.toObject()
        let rest;
        if (updatedAgentObj) {
            const { password, ...otherFields } = updatedAgentObj;
            rest = otherFields;
        } else {
            rest = {};
        }
        res.status(201).json({
            success: true,
            message: 'Agent approved successfully',
            data: rest
        })
    } catch (error) {
        next(error)
    }
}

export const suspendAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wallet = await Agent.findById(req.params.id)
        if (!wallet) {
            throw new AppError(400, 'No agent found')
        }
        const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, { isApproved: 'SUSPEND' }, { new: true, runValidators: true })
        const updatedAgentObj = updatedAgent?.toObject()
        let rest;
        if (updatedAgentObj) {
            const { password, ...otherFields } = updatedAgentObj;
            rest = otherFields;
        } else {
            rest = {};
        }
        res.status(201).json({
            success: true,
            message: 'Agent suspended successfully',
            data: rest
        })
    } catch (error) {
        next(error)
    }
}

export const AdminController = {
    getUsers,
    getAgents,
    getWallets,
    blockWallet,
    unblockWallet,
    approveAgent,
    suspendAgent
}