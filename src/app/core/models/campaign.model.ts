import { AdService } from "./ad-service.model";
import { Organization } from "./organization.model";
import { Project } from "./project.model";
import { User } from "./user.model";

export class Campaign {
    adStaff: User;
    averageSession: number;
    campaignAds: any;
    campaignId: number;
    careRatio: number;
    contentStaff: User;
    conversions: number;
    conversionsRatio: number;
    createdBy: User;
    createdUtcDate: string;
    currency: number;
    customRate: string;
    customer: User;
    dailyPayment: number;
    description: string;
    endDate: string;
    fee: number;
    fixedAmount: number;
    fixedPayment: number;
    fixedRate: number;
    goal: string;
    hotline: string;
    interact: number;
    isActive: boolean;
    isDelete: boolean;
    isFixed: boolean;
    keywordScore: number;
    modifiedUtcDate: string;
    organization: Organization;
    performanceId: any;
    performanceRate: any;
    performanceString: string;
    planningStaff: User;
    project: Project
    rateAmount: number;
    roi: number;
    search: number;
    service: AdService;
    startDate: string;
    totalCare: number;
    viewEveryTenSeconds: number;
    projectName?: string;
}
