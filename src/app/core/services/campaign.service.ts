import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class CampaignService extends BaseService {
    constructor(
        private http: HttpClient,
    ){
        super();
    }

    getCampaigns(params) {
        return this.http.post(`${this.campaignUrl}/campaigns`, params);
    }
}
