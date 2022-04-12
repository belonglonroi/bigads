import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult, ApiResult } from 'src/app/core/models/api-result.model';
import { Role } from 'src/app/core/models/role.model';
import { RoleService } from 'src/app/core/services/role.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-promote-role',
    templateUrl: './dialog-promote-role.component.html',
    styleUrls: ['./dialog-promote-role.component.scss']
})
export class DialogPromoteRoleComponent extends BaseClass implements OnInit {

    roles: Role[] = [];
    selectedRoles: Role;

    constructor(
        private roleService: RoleService,
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private userService: UserService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.roleService.getListRole({ page: 1, limit: 9999 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Role[]>) => {
                    this.roles = res.data.records;
                    this.selectedRoles = this.roles.find(e => e.roleName === this.dialogConfig.data.role)
                }
            });
    }

    submitHandler() {
        if (!this.selectedRoles) {
            return;
        }

        const param = {
            userId: this.dialogConfig.data?.id,
            roleId: this.selectedRoles.roleId,
        }

        this.userService.promoteRole(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
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
