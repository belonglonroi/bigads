import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY, MESSAGE_CONTENT } from 'src/app/core/consts/message.const';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-create-employee',
    templateUrl: './dialog-create-employee.component.html',
    styleUrls: ['./dialog-create-employee.component.scss']
})
export class DialogCreateEmployeeComponent extends BaseClass implements OnInit {

    invalid: boolean = false;
    formCreate = {
        phone: '',
        password: '',
        confirmPassword: ''
    }

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private userService: UserService,
        private fb: FormBuilder,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
    ) {
        super();
    }

    ngOnInit(): void {
    }

    submitHandler() {
        if (!this.formCreate.phone || !this.formCreate.password || !this.formCreate.confirmPassword) {
            this.invalid = true;
            return;
        }

        this.userService.register(this.formCreate)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.dialogRef.close(true);
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    })
                }
            });
    }

}
