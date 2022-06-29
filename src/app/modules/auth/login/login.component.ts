import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    MESSAGE_CONTENT,
    MESSAGE_SUMARY,
    MESSAGE_TYPE,
} from 'src/app/core/consts/message.const';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseClass implements OnInit {
    formLogin = {
        phone: localStorage.getItem('user') ?? '',
        password: '',
    };
    invalid: boolean = false;
    themeElement: any;
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private messageConfigService: MessageConfigService,
        private translate: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        super();
    }

    ngOnInit(): void {
        const theme =
            JSON.parse(localStorage.getItem('appConfig'))?.theme ?? 'saga-blue';
        this.themeElement = document.getElementById('theme-css');
        this.themeElement.setAttribute(
            'href',
            `assets/theme/${theme}/theme.css`
        );
    }

    ngOnDestroy(): void {
        // this.themeElement.setAttribute('href', 'assets/theme/saga-blue/theme.css');
    }

    loginHandler() {
        if (!this.formLogin.phone || !this.formLogin.password) {
            this.invalid = true;
            return;
        }

        localStorage.setItem('user', this.formLogin.phone);

        this.loading = true;

        this.authService
            .login(this.formLogin)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: () => {
                    this.loading = false;
                    const redirectURL =
                        this.activatedRoute.snapshot.queryParamMap.get(
                            'redirectURL'
                        ) || 'employees/profile';
                    this.router.navigateByUrl(redirectURL);
                    this.messageConfigService.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant(
                            MESSAGE_CONTENT.login_success
                        ),
                    });
                },
                error: (err) => {
                    this.loading = false;
                    if (
                        err instanceof HttpErrorResponse &&
                        err.status === 401
                    ) {
                        this.messageConfigService.messageConfig.next({
                            severity: MESSAGE_TYPE.error,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.error
                            ),
                            detail: this.translate.instant(
                                MESSAGE_CONTENT.login_fail
                            ),
                        });
                    }
                    if (
                        err instanceof HttpErrorResponse &&
                        err.status === 500
                    ) {
                        this.messageConfigService.messageConfig.next({
                            severity: MESSAGE_TYPE.error,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.error
                            ),
                            detail: this.translate.instant(
                                MESSAGE_CONTENT.internal_server
                            ),
                        });
                    }
                    if (
                        err instanceof HttpErrorResponse &&
                        err.status === 400
                    ) {
                        this.messageConfigService.messageConfig.next({
                            severity: MESSAGE_TYPE.error,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.error
                            ),
                            detail: this.translate.instant(
                                MESSAGE_CONTENT.login_fail
                            ),
                        });
                    }
                },
            });
    }
}
