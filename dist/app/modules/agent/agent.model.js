"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose_1 = require("mongoose");
const agent_interface_1 = require("./agent.interface");
const user_interface_1 = require("../user/user.interface");
const user_moel_1 = require("../user/user.moel");
const agentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.AGENT
    },
    phone: { type: String },
    status: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE
    },
    auths: [user_moel_1.authProviderSchema],
    isApproved: {
        type: String,
        enum: Object.values(agent_interface_1.isApproved),
        default: agent_interface_1.isApproved.NOT_APPROVED
    },
    commissionRate: {
        type: Number,
        default: 5, // commission = (amount / 1000) * commissionRate;
        immutable: true
    },
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Wallet',
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Agent = (0, mongoose_1.model)('Agent', agentSchema);
