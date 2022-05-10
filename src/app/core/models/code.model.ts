import { User } from "./user.model";

export interface Code {
    code: string;
    codeId: number;
    createdBy: User;
    createdUtdDate: string;
    expireAt: number;
    isDelete: false;
}
