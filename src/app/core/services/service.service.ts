import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { AdService } from '../models/ad-service.model';
import { ApiResult } from '../models/api-result.model';

@Injectable({
    providedIn: 'root'
})
export class AdServiceService extends BaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getService(query: { limit: number, page: number }): Observable<ApiResult<AdService>> {
        return this.http.get<ApiResult<AdService>>(`${this.serviceUrl}/root?page=${query.page}&limit=${query.limit}`);
    }

    getAllService(query: { limit: number, page: number, serviceTypeId: number }): Observable<ApiResult<AdService>> {
        return this.http.get<ApiResult<AdService>>(`${this.serviceUrl}/services?page=${query.page}&limit=${query.limit}&serviceTypeId=${query.serviceTypeId}`);
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
