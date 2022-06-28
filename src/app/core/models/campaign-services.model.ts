import { AdService } from "./ad-service.model";
import { CampaignAds } from "./campaign-ads.model";
import { Campaign } from "./campaign.model";
import { User } from "./user.model"

export class CampaignService {
    adStaff: User;
    averageSession: number;
    campaign: Campaign;
    campaignAds: CampaignAds[];
    campaignServiceId: number;
    careRatio: number;
    contentStaff: User;
    conversions: number;
    conversionsRatio: number;
    endDate: string;
    interact: number;
    keywordScore: number;
    planningStaff: User;
    roi: number;
    search: number;
    service: AdService;
    startDate: string;
    totalCare: number;
    viewEveryTenSeconds: number;
    customerName?: string;
    project?: string;
    serviceName?: string;
    hotline?: string;
    note?: string;
    adStaffName?: string;
    contentStaffName?: string;
    planningStaffName?: string;
    name?: string;
    campaignAdsIndex?: CampaignAds;
    description?: string;
    performanceString?: string;
    campaignAccounting?: number;
    customerAccounting?: number;
}
