"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.authProviderSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
exports.authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER
    },
    phone: { type: String },
    status: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE
    },
    auths: [exports.authProviderSchema],
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Wallet',
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)('User', userSchema);
