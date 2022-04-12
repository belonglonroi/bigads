import { Campaign } from "./campaign.model";
import { Organization } from "./organization.model";
import { User } from "./user.model";

export class Transaction {
    amount: number;
    campaign: Campaign;
    campaignPaymentId: number;
    createdBy: User;
    createdUtcDate: string;
    customer: User;
    isDelete: boolean;
    modifiedUtcDate: string;
    note: string;
    organization: Organization;
    paymentDate: string;
    paymentType: number;
    customerName?: string;
    phone?: string;
    campaignDescription?: string;
    transactionDate?: string;
    createdByName?: string;
    createdDate?: string;
    hotline?: string;
}
