import mongoose from "mongoose"
import { IAgent } from "./agent.interface"
import { Agent } from "./agent.model"
import AppError from "../../errorHelper/AppError"
import httpStatus from 'http-status-codes'
import { envVars } from "../../config/env"
import bcryptjs from 'bcryptjs'
import { IAuthProvider, IsActive } from "../user/user.interface"
import { Wallet } from "../wallet/wallet.model"
import { WalletType } from "../wallet/wallet.interface"

const createAgent = async (payload: Partial<IAgent>) => {
    const { email, password, ...rest } = payload

    const session = await mongoose.startSession()

    try {

        session.startTransaction()

        const isUserExist = await Agent.findOne({ email })

        if (isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Agent already exist')
        }

        const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

        const createdUser = await Agent.create([{
            email,
            password: hashedPassword,
            auths: [authProvider],
            ...rest
        }], { session })

        const wallet = await Wallet.create(
            [
                {
                    ownerId: createdUser[0]._id,
                    ownerModel: "Agent",
                    balance: 50,
                    type: WalletType.AGENT,
                    isActive: IsActive.ACTIVE,
                },
            ],
            { session }
        );

        const updatedUser = await Agent.findByIdAndUpdate(
            createdUser[0]._id,
            { wallet: wallet[0]._id },
            { new: true, runValidators: true, session }
        )
            .populate('wallet', "balance type")

        await session.commitTransaction();
        session.endSession();

        return updatedUser
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }


}

export const AgentService = {
    createAgent
}