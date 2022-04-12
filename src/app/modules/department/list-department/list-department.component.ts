import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { Department } from 'src/app/core/models/department.model';
import { DeparmentService } from 'src/app/core/services/department.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogAddEmployeeComponent } from '../dialog-add-employee/dialog-add-employee.component';
import { DialogDepartmentComponent } from '../dialog-department/dialog-department.component';

@Component({
    selector: 'app-list-department',
    templateUrl: './list-department.component.html',
    styleUrls: ['./list-department.component.scss'],
    providers: [DialogService]
})
export class ListDepartmentComponent extends BaseClass implements OnInit {

    departments: Department[] = [];
    filter = {
        name: '',
        page: this.page,
        limit: this.limit,
    }
    fetchingData: boolean = false;
    actions: number[] = [];
    constructor(
        private departmentService: DeparmentService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private dialog: DialogService,
        private userService: UserService
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.getDepartments();
    }

    getDepartments() {
        this.fetchingData = true;
        this.departmentService.getDepartments(this.filter)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Department[]>) => {
                    this.fetchingData = false;
                    this.departments = res.data.records;
                    this.totalRecords = res.data.total;
                }
            })
    }

    openDialog(e?) {
        const dialogRef = this.dialog.open(DialogDepartmentComponent, {
            header: e ? this.translate.instant('Update_department') : this.translate.instant('Add_department'),
            data: e,
            width: '350px'
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getDepartments();
                }
            }
        })
    }

    openDialogAddEmployees(e: Department) {
        const dialogRef = this.dialog.open(DialogAddEmployeeComponent, {
            header: this.translate.instant('Add_employee'),
            data: e,
            width: '350px'
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getDepartments();
                }
            }
        })
    }

    delete(e: Department) {
        this.departmentService.deleteDepartment(e.departmentId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getDepartments();
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

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getDepartments();
    }

    searchByName(e: string) {
        this.filter.name = e;
        this.getDepartments();
    }

}
