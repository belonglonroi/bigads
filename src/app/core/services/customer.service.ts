import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerService extends BaseService {
    constructor(
        private http: HttpClient
    ) {
        super();
    }

    get storageTable() {
        return localStorage.getItem('customerRp');
    }

    getCustomers(params) {
        return this.http.post(`${this.userUrl}/customers`, params)
    }

    createCustomer(params) {
        return this.http.post(`${this.userUrl}/create-customer`, params);
    }

    updateCustomer(params) {
        return this.http.post(`${this.userUrl}/update-customer`, params);
    }

    deleteCustomer(id) {
        return this.http.delete(`${this.userUrl}/customer/${id}`);
    }

    bulkCreateCustomer(param) {
        return this.http.post(`${this.userUrl}/bulk-create-customer`, param);
    }
}
