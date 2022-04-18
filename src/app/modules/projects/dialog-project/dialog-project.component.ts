import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult, ApiResult } from 'src/app/core/models/api-result.model';
import { Category } from 'src/app/core/models/category.model';
import { Project } from 'src/app/core/models/project.model';
import { Role } from 'src/app/core/models/role.model';
import { CategoryService } from 'src/app/core/services/category.service';
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
        categoryId: null,
        parentId: null
    }
    projects: Project[] = [];
    categories: Category[] = [];

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        private projectService: ProjectService,
        private categoryService: CategoryService,
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.config.data) {
            this.dialogData = {
                ...this.config.data,
                categoryId: this.config.data.category.categoryId
            }
        }

        this.getInitialData();
    }

    getInitialData() {
        const getProjects = this.projectService.getProjects({ limit: 9999, page: this.page });
        const getCategories = this.categoryService.getCategories({ limit: 9999, page: this.page, name: '' });

        forkJoin([getProjects, getCategories])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: [ApiPagingResult<Project[]>, ApiPagingResult<Category[]>]) => {
                    console.log(res)
                    this.projects = res[0].data.records;
                    this.categories = res[1].data.records;
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
