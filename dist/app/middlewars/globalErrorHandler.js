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
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong";
    let errorDetails = [];
    // Custom AppError
    if (err instanceof AppError_1.default) {
        console.log(err);
        statusCode = err.statusCode;
        message = err.message;
    }
    // Zod validation error
    else if (err instanceof zod_1.ZodError) {
        console.log(err);
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = "Validation failed";
        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
    // Mongoose ValidationError (example: required fields)
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        console.log(err);
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = "Mongoose validation error";
        errorDetails = Object.values(err.errors).map((el) => ({
            path: el.path,
            message: el.message,
        }));
    }
    // Mongoose CastError (example: invalid ObjectId)
    else if (err instanceof mongoose_1.default.Error.CastError) {
        console.log(err);
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Duplicate key error (MongoServerError)
    else if (err.code === 11000) {
        console.log(err);
        statusCode = http_status_codes_1.default.CONFLICT;
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate value for field(s): ${field}`;
    }
    // Generic JavaScript/other error
    else if (err instanceof Error) {
        console.log('coming from global error and Error');
        message = err.message;
    }
    // Response
    const responseBody = Object.assign({ success: false, message }, (errorDetails.length > 0 && { errors: errorDetails }));
    if (env_1.envVars.NODE_ENV === "development") {
        responseBody.stack = err.stack;
        responseBody.raw = err;
    }
    res.status(statusCode).json(responseBody);
});
exports.globalErrorHandler = globalErrorHandler;
