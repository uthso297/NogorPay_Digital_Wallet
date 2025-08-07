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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const agent_service_1 = require("./agent.service");
const createAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield agent_service_1.AgentService.createAgent(req.body);
        if (!agent) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Agent creation failed');
        }
        const agentObj = agent.toObject();
        const { _id, password } = agentObj, rest = __rest(agentObj, ["_id", "password"]);
        res.status(http_status_codes_1.default.CREATED).json({
            message: 'Agent created successfully',
            data: rest
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AgentController = {
    createAgent
};
