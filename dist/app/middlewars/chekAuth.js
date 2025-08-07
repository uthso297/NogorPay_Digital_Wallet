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
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_moel_1 = require("../modules/user/user.moel");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const agent_model_1 = require("../modules/agent/agent.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(404, 'Token not found!!!!');
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_SECRET);
        let isUserExist = yield user_moel_1.User.findOne({ email: verifiedToken.email });
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(404, 'You are not permitted in this route');
        }
        if (!isUserExist) {
            isUserExist = yield agent_model_1.Agent.findOne({ email: verifiedToken.email });
        }
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User doesn't Exist");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
