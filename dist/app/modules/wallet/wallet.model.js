"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const user_interface_1 = require("../user/user.interface");
const walletSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    ownerModel: {
        type: String,
        enum: ["User", "Agent"],
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 50,
    },
    type: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletType),
        required: true,
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
}, {
    timestamps: true,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
