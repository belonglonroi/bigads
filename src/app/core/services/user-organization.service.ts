import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
    providedIn: 'root'
})
export class UserOrganizationService extends BaseService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    create(param) {
        return this.http.post(`${this.userOrganizationUrl}/create`, param);
    }

    updateOwner(param) {
        return this.http.post(`${this.userOrganizationUrl}/update-owner`, param);
    }

    delete(param) {
        const reqOptions = {
            body: {
                ...param
            }
        }
        return this.http.delete(`${this.userOrganizationUrl}`, reqOptions);
    }
}
