import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends BaseService {
    get code() {
        return sessionStorage.getItem('code');
    }

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getOrganizations(param) {
        const path = this.code ? `${this.organizationUrl}/organizations?code=${this.code}` : `${this.organizationUrl}/organizations`;
        return this.http.post(path, param);
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
