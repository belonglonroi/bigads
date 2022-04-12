import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { ApiPagingResult, ApiResult } from 'src/app/core/models/api-result.model';
import { Role } from 'src/app/core/models/role.model';
import { RoleService } from 'src/app/core/services/role.service';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogPermissionComponent } from '../dialog-permission/dialog-permission.component';
import { TranslateService } from '@ngx-translate/core';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-list-permission',
    templateUrl: './list-permission.component.html',
    styleUrls: ['./list-permission.component.scss'],
    providers: [DialogService],
})
export class ListPermissionComponent extends BaseClass implements OnInit {

    roles: Role[] = [];
    fetchingData: boolean = false;
    actions: number[] = [];
    constructor(
        private roleService: RoleService,
        public dialogService: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private userService: UserService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.getRoles();
    }

    getRoles() {
        this.fetchingData = true;
        this.roleService.getListRole({ page: this.page, limit: this.limit })
            .pipe(
                this.unsubsribeOnDestroy,
                finalize(() => this.fetchingData = false)
            )
            .subscribe({
                next: (res: ApiPagingResult<Role[]>) => {
                    this.totalRecords = res.data.total;
                    this.transformData(res.data.records);
                },
                error: (err) => {
                    console.log(err)
                }
            });
    }

    transformData(data: Role[]) {
        this.roles = data.map(e => {
            return {
                ...e,
                createdDate: moment(e.createdUtcDate).format('DD/MM/YYYY'),
                modifiedDate: moment(e.modifiedUtcDate).format('DD/MM/YYYY'),
                createdName: e.createdBy.lastName + ' ' + e.createdBy.firstName,
            }
        })
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getRoles();
    }

    openDialog(e?: Role): void {
        const dialogRef = this.dialogService.open(DialogPermissionComponent, {
            header: !e ? this.translate.instant('Add_role') : this.translate.instant('Update_role'),
            width: '300px',
            data: e
        });

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getRoles();
                }
            }
        })
    }

    delete(e: Role) {
        this.roleService.deleteRole(e.roleId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getRoles();
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
    }

    toggleState(item: Role, e) {
        const param = {
            roleId: item.roleId,
            isActive: e.checked
        }
        this.roleService.changeStateRole(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getRoles();
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    })
                    this.getRoles();
                }
            })
    }

}
