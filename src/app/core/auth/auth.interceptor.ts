import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let newReq = req.clone();
        const helper = new JwtHelperService();

        if (this.authService.accessToken && !helper.isTokenExpired(this.authService.accessToken)) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this.authService.accessToken)
            });
        }

        return next.handle(newReq).pipe(
            catchError((error) => {

                if (error instanceof HttpErrorResponse && error.status === 401) {

                    this.authService.logout();

                    location.reload();
                }

                if (error instanceof HttpErrorResponse && error.status === 403) {
                    this.router.navigateByUrl('/error/403');
                }

                return throwError(() => error);
            })
        );
    }
}
