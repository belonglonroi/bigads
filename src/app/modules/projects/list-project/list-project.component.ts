import { Component, OnInit } from '@angular/core';
import { BaseClass } from 'src/app/core/base/base.class';
import { ApiPagingResult, ApiResult } from 'src/app/core/models/api-result.model';
import { Project } from 'src/app/core/models/project.model';
import { ProjectService } from 'src/app/core/services/project.service';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogProjectComponent } from '../dialog-project/dialog-project.component';
import { TranslateService } from '@ngx-translate/core';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-list-project',
    templateUrl: './list-project.component.html',
    styleUrls: ['./list-project.component.scss'],
    providers: [DialogService]
})
export class ListProjectComponent extends BaseClass implements OnInit {

    projects: Project[] = [];
    fetchingData: boolean = false;
    actions: number[] = [];
    filter = {
        name: '',
        page: this.page,
        limit: this.limit
    }
    constructor(
        private projectService: ProjectService,
        public dialogService: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private userService: UserService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.getProjects();
    }

    getProjects() {
        this.fetchingData = true;

        this.projectService.getProjects(this.filter)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Project[]>) => {
                    this.totalRecords = res.data.total;
                    this.transformData(res.data.records);
                    this.fetchingData = false;
                },
                error: () => {

                }
            });
    }

    searchByName(e: string) {
        this.filter.name = e;
        this.getProjects();
    }

    transformData(data: Project[]) {
        this.projects = data.map(e => {
            return {
                ...e,
                createdDate: moment(e.createdUtcDate).format('DD/MM/YYYY'),
                modifiedDate: moment(e.mofifiedUtcDate).format('DD/MM/YYYY'),
                createdName: e.createdBy.lastName + ' ' + e.createdBy.firstName,
            }
        })
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getProjects();
    }

    openDialog(e: Project) {
        const dialogRef = this.dialogService.open(DialogProjectComponent, {
            header: !e ? this.translate.instant('Add_project') : this.translate.instant('Update_project'),
            width: '300px',
            data: e
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getProjects();
                }
            }
        })
    }

    delete(e: Project) {
        this.projectService.deleteProject(e.projectId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getProjects();
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

}
