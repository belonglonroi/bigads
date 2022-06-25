import { CampaignService } from "./campaign-services.model";
import { Campaign } from "./campaign.model";
import { Organization } from "./organization.model";
import { User } from "./user.model";

export interface Code {
    name: string;
    organizations: Organization[];
    campaignServices: CampaignService[];
    campaigns: Campaign[];
    code: string;
    codeId: number;
    createdBy: User;
    createdUtdDate: string;
    customers: User[];
    expireAt: number;
    isDelete: false;
}
