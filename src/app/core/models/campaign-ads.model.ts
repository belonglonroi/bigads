import { AdService } from './ad-service.model';
import { CampaignService } from './campaign-services.model';
import { Campaign } from './campaign.model';
import { User } from './user.model';

export class CampaignAds {
    adAccount?: string;
    amount?: number;
    approach?: number;
    campaign?: Campaign;
    campaignAdId?: number;
    campaignId?: number;
    click?: number;
    comment?: number;
    cpc?: number;
    cpm?: number;
    cpr?: number;
    createdUtcDate?: string;
    ctr?: number;
    feeAmount?: number;
    frequency?: number;
    goal?: number;
    inputDate?: string;
    inputDateTime?: string;
    isDelete?: boolean;
    isActive?: boolean;
    isLock?: boolean;
    like?: number;
    message?: number;
    mofidiedUtcDate?: string;
    performanceId?: number;
    performanceString?: string;
    result?: number;
    timeView?: number;
    view?: number;
    customerName?: string;
    project?: string;
    service?: AdService;
    hotline?: string;
    startDate?: string;
    endDate?: string;
    adStaffName?: string;
    planningStaffName?: string;
    contentStaffName?: string;
    serviceName?: string;
    adStaff?: User;
    contentStaff?: User;
    planningStaff?: User;
    campaignService?: CampaignService;
    description?: string;
    taxRate?: number;
    taxAmount?: number;
}
