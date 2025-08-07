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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.logout = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const passport_1 = __importDefault(require("passport"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const userTokens_1 = require("../../utils/userTokens");
const auth_service_1 = require("./auth.service");
const credentialsLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const loginInfo = await AuthServices.credentialsLogin(req.body)
        passport_1.default.authenticate('local', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(new AppError_1.default(401, err));
            }
            if (!user) {
                return next(new AppError_1.default(401, info.message));
            }
            const userToken = (0, userTokens_1.createUserTokens)(user);
            res.cookie('accessToken', userToken, {
                httpOnly: true,
                secure: false
            });
            res.status(http_status_codes_1.default.OK).json({
                success: true,
                message: 'Log in successfull',
                userToken
            });
        }))(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.user;
        const result = yield auth_service_1.AuthServices.getMe(decodedToken.userId);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Your profile retrived successfuly',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false
    });
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Logged out Successfully",
    });
});
exports.logout = logout;
exports.AuthController = {
    credentialsLogin,
    getMe,
    logout: exports.logout
};
