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
