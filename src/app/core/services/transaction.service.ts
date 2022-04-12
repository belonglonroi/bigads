import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionService extends BaseService {
    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    getTransactions(param) {
        return this.http.post(`${this.campaignPaymentUrl}/filter`, param);
    }

    createTransaction(param) {
        return this.http.post(`${this.campaignPaymentUrl}/create`, param);
    }

    updateTransaction(param) {
        return this.http.post(`${this.campaignPaymentUrl}/update`, param);
    }

    deleteTransaction(id) {
        return this.http.delete(`${this.campaignPaymentUrl}/${id}`);
    }

    details(id) {
        return this.http.get(`${this.campaignPaymentUrl}/${id}`);
    }
}
