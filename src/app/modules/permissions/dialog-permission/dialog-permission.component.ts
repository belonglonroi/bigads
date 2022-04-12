import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiResult } from 'src/app/core/models/api-result.model';
import { GroupAction, Role, RoleAction } from 'src/app/core/models/role.model';
import { RoleService } from 'src/app/core/services/role.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-permission',
    templateUrl: './dialog-permission.component.html',
    styleUrls: ['./dialog-permission.component.scss']
})
export class DialogPermissionComponent extends BaseClass implements OnInit {

    actions: any = [];
    selectedActions: RoleAction[] = [];
    invalid: boolean = false
    dialogData = {
        roleName: '',
        description: '',
        roleActionIds: [],
    }

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private roleService: RoleService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService
    ) {
        super();
    }

    ngOnInit(): void {

        if (this.config.data) {
            this.dialogData = {
                ...this.config.data,
                roleActionIds: this.config.data.roleActions.map(e => e.actionId)
            }
        }

        this.getActions();
    }

    getActions() {
        this.roleService.getListActions()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiResult<GroupAction[]>) => {
                    this.actions = res.data.map((e: GroupAction) => {
                        return {
                            ...e,
                            label: e.name,
                            value: e.actionGroupId,
                            items: e.actions.map((x: RoleAction) => {
                                return {
                                    ...x,
                                    value: x.actionId,
                                    label: x.description
                                }
                            })
                        }
                    });
                    console.log(this.actions)
                },
                error: (err) => {

                }
            })
    }

    create() {
        if (!this.dialogData.roleName || !this.dialogData.description || this.dialogData?.roleActionIds.length === 0) {
            this.invalid = true
            return;
        }
        this.invalid = false;
        this.roleService.createRole(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiResult<Role>) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Create_role_successfully'),
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
            });
    }

    update() {
        if (!this.dialogData.roleName || !this.dialogData.description || this.dialogData?.roleActionIds.length === 0) {
            this.invalid = true
            return;
        }
        this.invalid = false;

        const params = {
            ...this.dialogData,
            roleId: this.config.data.roleId
        }

        this.roleService.updateRole(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiResult<Role>) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Update_role_successfully'),
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
            });
    }

}
