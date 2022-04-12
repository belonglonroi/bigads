import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiResult } from 'src/app/core/models/api-result.model';
import { Role } from 'src/app/core/models/role.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { RoleService } from 'src/app/core/services/role.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-project',
    templateUrl: './dialog-project.component.html',
    styleUrls: ['./dialog-project.component.scss']
})
export class DialogProjectComponent extends BaseClass implements OnInit {

    invalid: boolean = false
    dialogData = {
        name: '',
        description: '',
    }

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        private projectService: ProjectService,
    ) {
        super();
    }

    ngOnInit(): void {
        if(this.config.data) {
            this.dialogData = {
                ...this.config.data
            }
        }
    }

    create() {
        if (!this.dialogData.name || !this.dialogData.description) {
            this.invalid = true
            return;
        }
        this.invalid = false;
        this.projectService.createProject(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiResult<Role>) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Create_project_successfully'),
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
        if (!this.dialogData.name || !this.dialogData.description) {
            this.invalid = true
            return;
        }

        this.invalid = false;

        const param = {
            ...this.dialogData,
            projectId: this.config.data.projectId
        }

        this.projectService.updateProject(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiResult<Role>) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Update_project_successfully'),
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
