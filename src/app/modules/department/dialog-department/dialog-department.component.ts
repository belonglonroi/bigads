import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { Department } from 'src/app/core/models/department.model';
import { Role } from 'src/app/core/models/role.model';
import { DeparmentService } from 'src/app/core/services/department.service';
import { RoleService } from 'src/app/core/services/role.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-department',
    templateUrl: './dialog-department.component.html',
    styleUrls: ['./dialog-department.component.scss']
})
export class DialogDepartmentComponent extends BaseClass implements OnInit {

    dialogData = {
        name: '',
        description: '',
        parentId: null,
        roleId: null,
    }
    invalid: boolean = false;
    departments: Department[] = [];
    roles: Role[] = [];

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private departmentService: DeparmentService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private roleService: RoleService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.config.data) {
            this.dialogData = {
                ...this.config.data,
                // parentId: this.config.data.parentId,
            }
        }

        const getListDepartments = this.departmentService.getDepartments({ name: '', limit: 9999, page: this.page });
        const getListRoles = this.roleService.getListRole({ page: 1, limit: 9999 });

        forkJoin([getListDepartments, getListRoles])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: [ApiPagingResult<Department[]>, ApiPagingResult<Role[]>]) => {
                    this.departments = res[0].data.records;
                    this.roles = res[1].data.records;
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    })
                }
            });
    }

    create() {
        if (this.dialogData.name) {
            this.departmentService.createDepartment(this.dialogData)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        if (res.data) {
                            this.messageConfig.messageConfig.next({
                                severity: MESSAGE_TYPE.success,
                                summary: this.translate.instant(MESSAGE_SUMARY.success),
                                detail: this.translate.instant('Create_department_successfully'),
                            });

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
                })
        } else {
            this.invalid = true;
        }
    }

    update() {
        if (this.dialogData.name) {
            const params = {
                departmentId: this.config.data?.departmentId,
                name: this.dialogData.name,
                description: this.dialogData.description,
                parentId: this.dialogData.parentId,
                roleId: this.dialogData.roleId,
            }
            this.departmentService.updateDepartment(params)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        if (res.data) {
                            this.messageConfig.messageConfig.next({
                                severity: MESSAGE_TYPE.success,
                                summary: this.translate.instant(MESSAGE_SUMARY.success),
                                detail: this.translate.instant('Update_department_successfully'),
                            });

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
                })
        } else {
            this.invalid = true;
        }
    }


}
