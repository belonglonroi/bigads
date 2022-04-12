import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ApiResult } from '../models/api-result.model';
import { Role, RoleAction } from '../models/role.model';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getListRole(query: { page: number, limit: number }): Observable<ApiResult<Role[]>> {
        return this.http.get<ApiResult<Role[]>>(`${this.roleUrl}/roles?page=${query.page}&limit=${query.limit}`);
    }

    createRole(params) {
        return this.http.post(`${this.roleUrl}/create`, params);
    }

    updateRole(params) {
        return this.http.post(`${this.roleUrl}/update`, params);
    }

    deleteRole(id) {
        return this.http.delete(`${this.roleUrl}/${id}`);
    }

    changeStateRole(params) {
        return this.http.post(`${this.roleUrl}/active`, params);
    }

    getListActions(): Observable<ApiResult<RoleAction[]>> {
        return this.http.get<ApiResult<RoleAction[]>>(`${this.roleUrl}/actions`);
    }
}
