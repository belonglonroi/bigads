import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ApiResult } from '../models/api-result.model';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends BaseService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getProjects(param?): Observable<ApiResult<Project[]>> {
        return this.http.post<ApiResult<Project[]>>(`${this.projectUrl}/projects`, param ?? {});
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
