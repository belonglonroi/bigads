import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { AdService } from '../models/ad-service.model';
import { ApiResult } from '../models/api-result.model';

@Injectable({
    providedIn: 'root',
})
export class AdServiceService extends BaseService {
    get code() {
        return sessionStorage.getItem('code');
    }

    constructor(private http: HttpClient) {
        super();
    }

    getService(query: {
        limit: number;
        page: number;
    }): Observable<ApiResult<AdService>> {
        const code = this.code ? `&code=${this.code}` : '';
        return this.http.get<ApiResult<AdService>>(
            `${this.serviceUrl}/root?page=${query.page}&limit=${query.limit}${code}`
        );
    }

    getAllService(query: {
        limit: number;
        page: number;
        serviceTypeId: number;
    }): Observable<ApiResult<AdService>> {
        const code = this.code ? `&code=${this.code}` : '';
        return this.http.get<ApiResult<AdService>>(
            `${this.serviceUrl}/services?page=${query.page}&limit=${query.limit}&serviceTypeId=${query.serviceTypeId}${code}`
        );
    }

    createService(param) {
        return this.http.post(`${this.serviceUrl}/create`, param);
    }

    updateService(param) {
        return this.http.post(`${this.serviceUrl}/update`, param);
    }

    activeService(param) {
        return this.http.post(`${this.serviceUrl}/active`, param);
    }

    deleteService(id) {
        return this.http.delete(`${this.serviceUrl}/${id}`);
    }
}
