import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-change-password',
    templateUrl: './dialog-change-password.component.html',
    styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent extends BaseClass implements OnInit {

    dialogData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    }
    invalid: boolean = false;
    notMatch: boolean = false;

    constructor(
        public dialogRef: DynamicDialogRef,
        private userService: UserService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        public dialogConfig: DynamicDialogConfig,
    ) {
        super();
    }

    ngOnInit(): void {
    }

    checkPassword() {
        if (this.dialogData.newPassword === this.dialogData.confirmPassword) {
            this.notMatch = false;
        } else {
            this.notMatch = true;
        }
    }

    submitHandler() {
        if (this.dialogConfig.data?.id) {
            if (!this.dialogData.confirmPassword || !this.dialogData.newPassword || this.notMatch) {
                this.invalid = true;
                return;
            }

            this.invalid = false;

            const params = {
                userId: this.dialogConfig.data.id,
                newPassword: this.dialogData.newPassword,
                confirmPassword: this.dialogData.confirmPassword
            }

            this.userService.adminChangePassword(params)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.messageConfig.messageConfig.next({
                            severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                            summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                            detail: err.error?.message ?? this.translate.instant('Internal_server'),
                        })
                    }
                })
        } else {
            if (!this.dialogData.oldPassword || !this.dialogData.confirmPassword || !this.dialogData.newPassword || this.notMatch) {
                this.invalid = true;
                return;
            }

            this.invalid = false;

            this.userService.changePassword(this.dialogData)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.dialogRef.close(true);
                    },
                    error: (err) => {
                        this.messageConfig.messageConfig.next({
                            severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                            summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                            detail: err.error?.message ?? this.translate.instant('Internal_server'),
                        })
                    }
                })
        }
    }

}
