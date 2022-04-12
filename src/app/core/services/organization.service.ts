import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends BaseService {
    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getOrganizations(param) {
        return this.http.post(`${this.organizationUrl}/organizations`, param);
    }

    createOrganization(param) {
        return this.http.post(`${this.organizationUrl}/create`, param);
    }

    updateOrganization(param) {
        return this.http.post(`${this.organizationUrl}/update`, param);
    }

    deleteOrganization(id) {
        return this.http.delete(`${this.organizationUrl}/${id}`);
    }

    getOrganizationDetail(id) {
        return this.http.get(`${this.organizationUrl}/detail/${id}`);
    }
}
