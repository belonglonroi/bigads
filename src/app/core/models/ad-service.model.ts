import { User } from "./user.model"

export class AdService {
    childrenService: AdService[];
    createdBy: User;
    createdUtcDate: string;
    description: string;
    isActive: boolean;
    isDelete: boolean;
    modifiedUtcDate: string;
    parentService: any;
    serviceId: number;
    serviceName: string;
    parentId?: number;
    isChildren?: boolean;
    serviceTypeId?: number | string;
}
