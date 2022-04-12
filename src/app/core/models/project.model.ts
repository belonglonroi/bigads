import { User } from "./user.model";

export class Project {
    campaigns: any;
    createdBy: User;
    createdUtcDate: string;
    description: string;
    isDelete: boolean;
    mofifiedUtcDate: string;
    name: string;
    projectId: number;
    createdDate?: string;
    modifiedDate?: string;
    createdName?: string;
}
