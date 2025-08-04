import { IUser } from "../user/user.interface";

export enum isApproved {
    APPROVED = 'APPROVED',
    NOT_APPROVED = 'NOT_APPROVED',

}

export interface IAgent extends IUser {
    commissionRate?: number;
    isApproved?: isApproved;
}