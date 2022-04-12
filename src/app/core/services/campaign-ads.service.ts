import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class CampaignAdsService extends BaseService {
    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    createCampaignAds(param) {
        return this.http.post(`${this.campaignAdUrl}/create`, param);
    }

    updateCampaignAds(param) {
        return this.http.post(`${this.campaignAdUrl}/update`, param);
    }

    getCampaignAds(param) {
        return this.http.post(`${this.campaignAdUrl}/campaign-ads`, param);
    }

    deleteCampaignAds(param) {
        return this.http.delete(`${this.campaignAdUrl}/${param}`);
    }

    toggleState(param) {
        return this.http.post(`${this.campaignAdUrl}/lock`, param);
    }
}
