"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const user_moel_1 = require("../user/user.moel");
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
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_moel_1.User.findById(userId)
        .select("-_id -password")
        .populate({
        path: "wallet",
        select: "balance isActive -_id",
    });
    return userInfo;
});
exports.AuthServices = {
    // credentialsLogin,
    getMe
};
