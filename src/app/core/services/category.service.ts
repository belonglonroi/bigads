import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getCategories(x) {
        return this.http.get(`${this.categoryUrl}/categories?name=${x.name}&page=${x.page}&limit=${x.limit}`);
    }

    createCategory(param) {
        return this.http.post(`${this.categoryUrl}/create`, param);
    }

    updateCategory(param) {
        return this.http.post(`${this.categoryUrl}/update`, param);
    }

    deleteCategory(id) {
        return this.http.delete(`${this.categoryUrl}/${id}`);
    }
}
