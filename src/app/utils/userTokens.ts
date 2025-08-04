import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";


export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayLoad = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayLoad, envVars.JWT_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }
}