import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root',
})
export class CampaignService extends BaseService {
    tab$ = new BehaviorSubject<number>(0);

    constructor(private http: HttpClient) {
        super();
    }

    get getTab(): number {
        return this.tab$.value;
    }

    set setTab(value: number) {
        this.tab$.next(value);
    }

    getCampaigns(params) {
        return this.http.post(`${this.campaignUrl}/campaigns`, params);
    }
}
