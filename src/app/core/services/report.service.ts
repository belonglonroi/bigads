import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../base/base.service';
import { CampaignAds } from '../models/campaign-ads.model';
import { CampaignFilter } from '../models/campaign-filter.model';
import { Campaign } from '../models/campaign.model';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService extends BaseService {

    dateFilter$ = new BehaviorSubject<Date[]>([]);
    filterBinding$ = new BehaviorSubject<any[]>([]);
    campaignFilter$ = new BehaviorSubject<CampaignFilter>({});
    selectedOrganization$ = new BehaviorSubject<Organization[]>([]);
    selectedCustomers$ = new BehaviorSubject<User[]>([]);
    selectedProjects$ = new BehaviorSubject<Campaign[]>([]);
    selectedCampaignAds$ = new BehaviorSubject<CampaignAds[]>([])

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    get selectedCustomers() {
        return this.selectedCustomers$.value;
    }

    getCustomers(param) {
        return this.http.post(`${this.reportUrl}/customers`, param);
    }

    getProjects(param) {
        return this.http.post(`${this.reportUrl}/campaigns`, param);
    }

    getCampaignAds(param) {
        return this.http.post(`${this.reportUrl}/campaign-ads`, param);
    }
}
