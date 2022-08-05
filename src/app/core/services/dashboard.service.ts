import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ApiPagingResult } from '../models/api-result.model';
import { Campaign } from '../models/campaign.model';

@Injectable({
    providedIn: 'root',
})
export class DashboardService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    chartCompareProjects(payload) {
        return this.http.post(`${this.reportUrl}/campaigns`, payload);
    }
}
