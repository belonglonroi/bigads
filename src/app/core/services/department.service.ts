import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class DeparmentService extends BaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getDepartments(x) {
        return this.http.get(`${this.departmentUrl}/departments?name=${x.name}&page=${x.page}&limit=${x.limit}`);
    }

    getDepartmentsTree(x) {
        return this.http.get(`${this.departmentUrl}/root-departments?name=${x.name}&page=${x.page}&limit=${x.limit}`);
    }

    createDepartment(param) {
        return this.http.post(`${this.departmentUrl}/create`, param);
    }

    updateDepartment(param) {
        return this.http.post(`${this.departmentUrl}/update`, param);
    }

    deleteDepartment(id) {
        return this.http.delete(`${this.departmentUrl}/${id}`);
    }

    addStaff(param) {
        return this.http.post(`${this.departmentUrl}/add-staff`, param);
    }

    deleteStaff(param) {
        return this.http.post(`${this.departmentUrl}/delete-staff`, param);
    }
}
