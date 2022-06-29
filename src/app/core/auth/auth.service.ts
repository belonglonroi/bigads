import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map, Observable, of, switchMap, throwError } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ApiResult } from '../models/api-result.model';
import { LoginParam, LoginResult } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends BaseService {
    isAuthenticated: boolean = false;
    token: string = '';

    constructor(private http: HttpClient, private userService: UserService) {
        super();
    }

    // set accessToken(token: string) {
    //     sessionStorage.getItem('accessToken') ??
    //         localStorage.getItem('accessToken');
    // }

    get accessToken() {
        return localStorage.getItem('accessToken');
    }

    login(param: LoginParam): Observable<any> {
        if (this.isAuthenticated) {
            return throwError(() => 'User is already logged in.');
        }

        return this.http
            .post<ApiResult<LoginResult>>(`${this.authUrl}/login`, param)
            .pipe(
                switchMap((response) => {
                    localStorage.setItem(
                        'accessToken',
                        response.data.accessToken
                    );

                    this.isAuthenticated = true;

                    return of(response);
                }),
                finalize(() => {
                    this.userService.get();
                })
            );
    }

    logout(): Observable<any> {
        localStorage.removeItem('accessToken');

        this.isAuthenticated = false;

        return of(true);
    }

    check(): Observable<boolean> {
        if (this.isAuthenticated) {
            return of(true);
        }

        if (!this.accessToken) {
            return of(false);
        }

        const helper = new JwtHelperService();

        if (helper.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        return of(true);
    }
}
