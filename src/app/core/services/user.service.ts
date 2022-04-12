import { BaseService } from './../base/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ListUserResult, User } from '../models/user.model';
import { ApiResult } from '../models/api-result.model';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService {

    user = new BehaviorSubject<User>(null);

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    set user$(e: User) {
        this.user.next(e);
    }

    get _user$(): Observable<User> {
        return this.user.asObservable();
    }

    get action() {
        return this.user.getValue().userRole.roleActions.map(e => e.actionId);
    }

    get() {
        return this.http.get(`${this.userUrl}/profile`).pipe(
            tap((user: ApiResult<User>) => {
                this.user.next(user.data);
            })
        );
    }

    getProfile() {
        return this.http.get(`${this.userUrl}/profile`);
    }

    getListUser(param): Observable<ApiResult<ListUserResult>> {
        return this.http.post<ApiResult<ListUserResult>>(`${this.userUrl}/users`, param);
    }

    register(param) {
        return this.http.post(`${this.userUrl}/register`, param);
    }

    updateProfile(param) {
        return this.http.post(`${this.userUrl}/profile`, param);
    }

    promoteRole(param) {
        return this.http.post(`${this.userUrl}/promote-role`, param);
    }

    getProfileById(id: number) {
        return this.http.get(`${this.userUrl}/profile/${id}`);
    }

    activeUser(id: number) {
        return this.http.post(`${this.userUrl}/active/${id}`, {});
    }

    disableUser(id: number) {
        return this.http.post(`${this.userUrl}/disable/${id}`, {});
    }

    changePassword(param) {
        return this.http.post(`${this.userUrl}/change-password`, param);
    }

    bulkCreateUser(param) {
        return this.http.post(`${this.userUrl}/bulk-create-staff`, param);
    }
}
