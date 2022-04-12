import { User } from "./user.model";

export class Category {
    categoryId: string;
    createdBy: User;
    createdUtcDate: string;
    description: string;
    isDelete: boolean
    modifiedUtcDate: string;
    name: string;
}
