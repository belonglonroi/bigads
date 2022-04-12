import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class CampaignServicesService extends BaseService {
    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getCampaignServices(param) {
        return this.http.post(`${this.campaignUrl}/campaign-services`, param);
    }

    createCampaignService(param) {
        return this.http.post(`${this.campaignUrl}/campaign-service`, param);
    }

    updateCampaignService(param) {
        return this.http.post(`${this.campaignUrl}/update-campaign-service`, param);
    }

    deleteCampaignService(param) {
        const reqOptions = {
            body: {
                ...param
            }
        }
        return this.http.delete(`${this.campaignUrl}/campaign-service`, reqOptions);
    }

    toggleStateCampaignService(param) {
        return this.http.post(`${this.campaignUrl}/active-campaign-service`, param);
    }
}
