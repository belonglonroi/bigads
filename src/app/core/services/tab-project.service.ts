import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class TabProjectService extends BaseService {
    constructor(
        private http: HttpClient
    ) {
        super();
    }

    get storageTable() {
        return localStorage.getItem('projectRp');
    }

    createProject(param) {
        return this.http.post(`${this.campaignUrl}/create`, param);
    }

    updateProject(param) {
        return this.http.post(`${this.campaignUrl}/update`, param);
    }

    deleteProjects(ids) {
        return this.http.delete(`${this.campaignUrl}/${ids}`)
    }

    changeStatus(param) {
        return this.http.post(`${this.campaignUrl}/active`, param);
    }
}
