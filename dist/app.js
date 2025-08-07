"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = require("./app/middlewars/globalErrorHandler");
require("./app/config/passport");
const notFound_1 = require("./app/middlewars/notFound");
const Routes_1 = require("./app/Routes");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use('/api', Routes_1.router);
app.get('/', (req, res) => {
    res.status(http_status_codes_1.default.OK).json({
        message: 'Welcome to NogorPay,a Digital Wallet Server 😍'
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
