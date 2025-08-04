import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.moel";
import bcryptjs from 'bcryptjs'
export const seedAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.ADMIN_EMAIL })
        if (isSuperAdminExist) {
            console.log('Admin Already Exist 👲');
            return
        }
        console.log('Trying to create admin🥳');
        const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASS, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.ADMIN_EMAIL
        }

        const payload: Partial<IUser> = {
            name: 'Admin',
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
            auths: [authProvider]
        }

        const admin = await User.create(payload)
        console.log('Admin created successfully');

    } catch (error) {
        console.log(error);
    }
}