import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IsActive, IUser } from "./user.interface";
import { User } from "./user.moel";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { WalletType } from "../wallet/wallet.interface";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const session = await mongoose.startSession()

    try {

        session.startTransaction()

        const isUserExist = await User.findOne({ email })

        if (isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User already exist')
        }

        const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

        const createdUser = await User.create([{
            email,
            password: hashedPassword,
            auths: [authProvider],
            ...rest
        }], { session })

        const wallet = await Wallet.create(
            [
                {
                    ownerId: createdUser[0]._id,
                    ownerModel: "User",
                    balance: 50,
                    type: WalletType.USER,
                    isActive: IsActive.ACTIVE,
                },
            ],
            { session }
        );

        const updatedUser = await User.findByIdAndUpdate(
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

export const UserService = {
    createUser
}