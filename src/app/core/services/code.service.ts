import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class CodeService extends BaseService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getCodes() {

    }

    createCode(params) {
        return this.http.post(`${this.codeUrl}`, params);
    }

    updateCode(params) {
        return this.http.post(`${this.codeUrl}/update`, params);
    }

    getListCode(params) {
        return this.http.get(`${this.codeUrl}/codes`, { params: params });
    }

    deleteCode(id: number) {
        return this.http.delete(`${this.codeUrl}/${id}`);
    }

    getDetails(id) {
        return this.http.get(`${this.codeUrl}/${id}`);
    }
}
