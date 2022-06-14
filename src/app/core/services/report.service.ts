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

    get code() {
        return sessionStorage.getItem('code');
    }

    getCustomers(param) {
        const path = this.code ? `${this.reportUrl}/customers?code=${this.code}` : `${this.reportUrl}/customers`;
        return this.http.post(path, param);
    }

    getProjects(param) {
        const path = this.code ? `${this.reportUrl}/campaigns?code=${this.code}` : `${this.reportUrl}/campaigns`;

        return this.http.post(path, param);
    }

    getCampaignAds(param) {
        const path = this.code ? `${this.reportUrl}/campaign-ads?code=${this.code}` : `${this.reportUrl}/campaign-ads`;
        return this.http.post(path, param);
    }

    getListProjects(params) {
        return this.http.post(`${this.campaignUrl}/campaigns`, params);
    }

    getListCampaignAds(params) {
        return this.http.post(`${this.campaignUrl}/campaign-services`, params);
    }
}
