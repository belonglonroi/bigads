import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_SUMARY, MESSAGE_TYPE } from 'src/app/core/consts/message.const';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogChangePasswordComponent } from '../dialog-change-password/dialog-change-password.component';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [DialogService]
})
export class ProfileComponent extends BaseClass implements OnInit {

    user: User;
    id: number;
    constructor(
        private userService: UserService,
        private activatedRouter: ActivatedRoute,
        private dialogService: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.userService.user.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (user) => {
                    this.user = user;
                }
            })
    }

    openDialogChangePass() {
        const dialogRef = this.dialogService.open(DialogChangePasswordComponent, {
            header: this.translate.instant('Change_password'),
            width: '350px'
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    location.reload();
                }
            }
        })
    }

    openDialogUpdateProfile() {
        const dialogRef = this.dialogService.open(DialogProfileComponent, {
            header: this.translate.instant('Update_profile'),
            width: '350px'
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant('Update_profile_successfully'),
                    });
                    this.userService.get()
                        .pipe(this.unsubsribeOnDestroy)
                        .subscribe({
                            next: (res) => {
                                this.userService.user.next(res.data)
                            },
                            error: (err) => {
                                this.messageConfig.messageConfig.next({
                                    severity: MESSAGE_TYPE.error,
                                    summary: this.translate.instant(MESSAGE_SUMARY.error),
                                    detail: err.error?.message ?? this.translate.instant('Internal_server'),
                                })
                            }
                        })
                }
            }
        })
    }

}
