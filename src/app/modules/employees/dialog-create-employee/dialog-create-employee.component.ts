import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { GENDER_SELECT } from 'src/app/core/consts/gender.const';
import { MESSAGE_TYPE, MESSAGE_SUMARY, MESSAGE_CONTENT } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { Department } from 'src/app/core/models/department.model';
import { DeparmentService } from 'src/app/core/services/department.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-create-employee',
    templateUrl: './dialog-create-employee.component.html',
    styleUrls: ['./dialog-create-employee.component.scss']
})
export class DialogCreateEmployeeComponent extends BaseClass implements OnInit {

    invalid: boolean = false;
    gender = GENDER_SELECT.map(e => {
        return {
            ...e,
            label: this.translate.instant(e.label)
        }
    });
    formCreate = {
        phone: '',
        lastName: '',
        firstName: '',
        email: '',
        genderId: 0,
        departmentId: 0,
        password: '',
        confirmPassword: ''
    }
    departments: Department[] = []

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private userService: UserService,
        private fb: FormBuilder,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        private deparmentService: DeparmentService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.deparmentService.getDepartments({ page: this.page, limit: 9999, name: '' })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Department[]>) => {
                    this.departments = res.data.records;
                },
                error: (err) => { }
            })
    }

    submitHandler() {
        console.log(this.formCreate)
        for (const key in this.formCreate) {
            if (!this.formCreate[key] && key !== 'email') {
                this.invalid = true;
                return;
            }
        }

        this.formCreate.phone.trim();

        this.userService.createStaff(this.formCreate)
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
