import { IUser } from "../user/user.interface";

export enum isApproved {
    APPROVED = 'APPROVED',
    PENDING = 'PENDING',
    NOT_APPROVED = 'NOT_APPROVED',

}

export interface IAgent extends IUser {
    commissionRate?: number;
    isApproved?: isApproved;
}