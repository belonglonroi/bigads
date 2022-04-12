import { Role } from "./role.model";

export class User {
    avatar?: string;
    businessStaff?: User;
    customerType?: any
    email?: string;
    feeRate?: number;
    firstName?: string;
    genderId: number;
    isActive: boolean;
    isCustomer: boolean;
    lastName?: string;
    phone?: string;
    userId: number;
    userRole: Role;
    accountingAmount?: number;
    expenditureAmount?: number;
    feeAmount?: number;
    performanceId?: number;
    performanceRate?: string;
    performanceString?: string;
    transactionAmount?: number;
    fullname?: string;
    lastLogin?: string;
}

export class ListUserResult {
    filter: any;
    paginate: any;
    records: User[];
    total: number;
}

export class TableUser {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    role: string;
    gender: string;
    isActive: boolean;
    lastLogin?: string;
}


