export class CampaignFilter {
    organizationIds?: string;
    customerIds?: string;
    campaignIds?: string;
    projectIds?: string;
    fromDate?: string;
    toDate?: string;
    campaignIsActive?: string;
    customerName?: CompareFilter;
    customerPhone?: CompareFilter;
    campaignHotLine?: CompareFilter;
    projectName?: CompareFilter;
    serviceName?: CompareFilter;
    adAccount?: CompareFilter;
    adStaffName?: CompareFilter;
    businesssStaffName?: CompareFilter;
    contentStaffName?: CompareFilter;
    planningStaffName?: CompareFilter;
    page?: number;
    limit?: number;
    customerNameStr?: string;
}

export class CompareFilter {
    compareId: number;
    value: string;
}

export interface CampaignSort {
    customerName?: string,
    performance?: string,
    hotline?: string,
    customerFeeRate?: string,
    customerPhone?: string,
    businessStaffName?: string,
    transactionAmount?: string,
    accountingAmount?: string,
    expenditureAmount?: string,
    feeAmount?: string,
    projectName?: string,
    dayLeft?: string,
    serviceName?: string,
    adAccount?: string,
    startDate?: string,
    endDate?: string,
    campaignServiceGoal?: string,
    campaignServiceName?: string,
    campaignServiceAmount?: string,
    campaignServiceResult?: string,
    campaignServiceCPR?: string,
    taxAmount?: string,
}
