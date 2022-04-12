import { User } from "./user.model";

export class Organization {
    address: string;
    createdUtcDate: string;
    description: string;
    fanpage: string;
    imageUrl: string;
    isActive: boolean;
    isDelete: boolean;
    modifiedUtcDate: string;
    organizationId: number;
    organizationName: string;
    users: User[];
    website: string;
}
