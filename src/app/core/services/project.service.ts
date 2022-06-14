import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ApiPagingResult, ApiResult } from '../models/api-result.model';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root',
})
export class ProjectService extends BaseService {
    get code() {
        return sessionStorage.getItem('code');
    }

    constructor(private http: HttpClient) {
        super();
    }

    getProjects(param?): Observable<ApiPagingResult<Project[]>> {
        const code = this.code ? `?code=${this.code}` : '';
        return this.http.post<ApiPagingResult<Project[]>>(
            `${this.projectUrl}/projects${code}`,
            param ?? {}
        );
    }

    getProjectsTree(param?): Observable<ApiPagingResult<Project[]>> {
        return this.http.post<ApiPagingResult<Project[]>>(
            `${this.projectUrl}/root-projects`,
            param ?? {}
        );
    }

    createProject(param) {
        return this.http.post(`${this.projectUrl}/create`, param);
    }

    updateProject(param) {
        return this.http.post(`${this.projectUrl}/update`, param);
    }

    deleteProject(id) {
        return this.http.delete(`${this.projectUrl}/${id}`);
    }
}
