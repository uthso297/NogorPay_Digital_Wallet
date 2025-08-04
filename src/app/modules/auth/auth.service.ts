import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.moel";
import httpStatus from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;
//     const isUserExist = await User.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'User not found...Please register and then login')
//     }
//     const matchedPassword = await bcrypt.compare(password as string, isUserExist.password)
//     if (!matchedPassword) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Wrong password..enter the correct password')
//     }

//     const jwtPayLoad = {
//         userId: isUserExist._id,
//         email: isUserExist.email,
//         role: isUserExist.role
//     }

//     const accessToken = generateToken(jwtPayLoad, envVars.JWT_SECRET, envVars.JWT_ACCESS_EXPIRES)

//     return {
//         accessToken
//     }
// }


export const AuthServices = {
    // credentialsLogin
}