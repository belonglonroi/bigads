import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { User } from 'src/app/core/models/user.model';
import { DeparmentService } from 'src/app/core/services/department.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-add-employee',
    templateUrl: './dialog-add-employee.component.html',
    styleUrls: ['./dialog-add-employee.component.scss']
})
export class DialogAddEmployeeComponent extends BaseClass implements OnInit {

    employees: User[] = [];
    selectedEmployees: number[];

    constructor(
        private userService: UserService,
        public config: DynamicDialogConfig,
        private departmentService: DeparmentService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.config.data?.users.length > 0) {
            this.selectedEmployees = this.config.data?.users.map(e => e.user.userId);
        }

        this.userService.getListUser({ limit: 99999, page: 1 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<User[]>) => {
                    this.employees = res.data.records.map(e => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName
                        }
                    })
                }
            });
    }

    changeHandler(e) {
        const param = {
            userId: e.itemValue,
            departmentId: parseInt(this.config.data.departmentId)
        }
        if (this.selectedEmployees.includes(e.itemValue)) {
            this.departmentService.addStaff(param)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
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
            this.departmentService.deleteStaff(param)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
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
