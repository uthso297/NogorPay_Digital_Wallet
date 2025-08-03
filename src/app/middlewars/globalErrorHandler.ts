import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { ZodError } from "zod";
import mongoose from "mongoose";
import AppError from "../errorHelper/AppError";
import httpStatus from 'http-status-codes'
export const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong";
    let errorDetails: any = [];

    // Custom AppError
    if (err instanceof AppError) {
        console.log(err);
        statusCode = err.statusCode;
        message = err.message;
    }

    // Zod validation error
    else if (err instanceof ZodError) {
        console.log(err);
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation failed";
        errorDetails = err.issues.map((issue: any) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }

    // Mongoose ValidationError (example: required fields)
    else if (err instanceof mongoose.Error.ValidationError) {
        console.log(err);
        statusCode = httpStatus.BAD_REQUEST;
        message = "Mongoose validation error";
        errorDetails = Object.values(err.errors).map((el: any) => ({
            path: el.path,
            message: el.message,
        }));
    }

    // Mongoose CastError (example: invalid ObjectId)
    else if (err instanceof mongoose.Error.CastError) {
        console.log(err);
        statusCode = httpStatus.BAD_REQUEST;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Duplicate key error (MongoServerError)
    else if (err.code === 11000) {
        console.log(err);
        statusCode = httpStatus.CONFLICT;
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate value for field(s): ${field}`;
    }

    // Generic JavaScript/other error
    else if (err instanceof Error) {
        message = err.message;
    }

    // Response
    const responseBody: any = {
        success: false,
        message,
        ...(errorDetails.length > 0 && { errors: errorDetails }),
    };

    if (envVars.NODE_ENV === "development") {
        responseBody.stack = err.stack;
        responseBody.raw = err;
    }

    res.status(statusCode).json(responseBody);
};
