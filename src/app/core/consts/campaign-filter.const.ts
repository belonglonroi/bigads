export const CAMPAIGN_FILTER_OPTIONS = [
    {
        label: 'Name', value: 'name',
        items: [
            { value: 'customerName', label: 'Customer_name' },
            { value: 'projectName', label: 'Project_name' },
            { value: 'campaignServiceName', label: 'Campaign_service_name'}
        ]
    },
    {
        label: 'Hotline', value: 'hotline',
        items: [
            { value: 'customerPhone', label: 'Customer_phone' },
            { value: 'campaignHotline', label: 'Campaign_hotline' },
        ]
    },
    {
        label: 'Other', value: 'other',
        items: [
            { value: 'campaignServiceAmount', label: 'Cost' },
            { value: 'campaignServiceIsActive', label: 'Status' },
            { value: 'serviceName', label: 'Service_name' },
            { value: 'adAccount', label: 'Ad_account' },
            { value: 'staffName', label: 'Staff_name' },
        ]
    },
    // { value: 'planningStaffName', label: 'Planning_staff_name' }
]

export const COMPARE_OPTIONS = [
    { value: 1, label: 'Equal' },
    { value: 2, label: 'Contain' },
    { value: 3, label: 'Not_contain' },
    { value: 4, label: 'Any' }
]
