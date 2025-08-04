import { model, Schema } from "mongoose";
import { IAgent, isApproved } from "./agent.interface";
import { IsActive, Role } from "../user/user.interface";
import { authProviderSchema } from "../user/user.moel";


const agentSchema = new Schema<IAgent>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.AGENT
    },
    phone: { type: String },
    status: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    auths: [authProviderSchema],
    isApproved: {
        type: String,
        enum: Object.values(isApproved),
        default: isApproved.NOT_APPROVED
    },
    commissionRate: {
        type: Number,
        default: 5,  // commission = (amount / 1000) * commissionRate;
        immutable: true
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

export const Agent = model<IAgent>('Agent', agentSchema)