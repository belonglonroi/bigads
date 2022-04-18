import { User } from "./user.model"

export class Department {
    createdBy: User
    createdUtcDate: string;
    departmentId: string;
    description: string;
    isDelete: boolean;
    modifiedUtcDate: string;
    name: string;
    users: User[];
    childDepartments?: Department[]
}
