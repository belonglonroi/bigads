import { User } from "./user.model";

export class Role {
    createdBy: User;
    createdUtcDate: string;
    description: string;
    isActive: boolean;
    isDelete: boolean;
    modifiedUtcDate: string;
    roleActions: RoleAction[];
    roleId: number;
    roleName: string;
    createdDate?: string;
    modifiedDate?: string;
}

export class GroupAction {
    actionGroupId: number;
    name: string;
    actions: RoleAction[];
    label?: string;
    value?: number;
    items?: string;

}

export class RoleAction {
    actionGroupId: number;
    actionId: number;
    actionName: string;
    description?: string;
    label?: string;
    value?: number;
}
