import { Types } from "mongoose";

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    AGENT = 'AGENT'
}

export enum IsActive {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BOLCKED = 'BOLCKED'
}


export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    auths: IAuthProvider[];
    phone: string;
    password: string;
    role: Role;
    status: IsActive;
    walletId?: Types.ObjectId;
    createdAt?: Date;

}
