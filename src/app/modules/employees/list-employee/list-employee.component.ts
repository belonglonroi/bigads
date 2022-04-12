import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseClass } from 'src/app/core/base/base.class';
import { ApiPagingResult, ApiResult } from 'src/app/core/models/api-result.model';
import { ListUserResult, TableUser, User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogCreateEmployeeComponent } from '../dialog-create-employee/dialog-create-employee.component';
import { TranslateService } from '@ngx-translate/core';
import { DialogPromoteRoleComponent } from '../dialog-promote-role/dialog-promote-role.component';
import { MESSAGE_SUMARY, MESSAGE_TYPE } from 'src/app/core/consts/message.const';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';
import { MenuItem } from 'primeng/api';
import { RoleService } from 'src/app/core/services/role.service';
import { Role } from 'src/app/core/models/role.model';
type AOA = any[][];

@Component({
    selector: 'app-list-employee',
    templateUrl: './list-employee.component.html',
    styleUrls: ['./list-employee.component.scss'],
    providers: [DialogService],
})
export class ListEmployeeComponent extends BaseClass implements OnInit {

    @ViewChild('file', { static: false }) file: ElementRef;
    @ViewChild('template', { static: false }) template: ElementRef;
    employees: TableUser[] = [];
    cols: any[];
    fetchingData: boolean = false;
    items: MenuItem[];
    filter = {
        name: '',
        roleId: 0,
        phone: '',
        isActive: null,
    };
    status = [
        { value: true, label: this.translate.instant('Active') },
        { value: false, label: this.translate.instant('Deactive') }
    ]
    roles: Role[] = [];
    actions: number[] = [];
    constructor(
        private messageConfig: MessageConfigService,
        private userService: UserService,
        private dialogService: DialogService,
        private translate: TranslateService,
        private roleService: RoleService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.items = [
            {
                label: this.translate.instant('Download_file_template'),
                icon: 'pi pi-download',
                command: () => {
                    this.template.nativeElement.click();
                },
            },
            {
                label: this.translate.instant('Upload_file'),
                icon: 'pi pi-upload',
                command: () => {
                    this.file.nativeElement.click();
                },
            }
        ];

        this.roleService.getListRole({ page: 1, limit: 99999 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Role[]>) => {
                    this.roles = res.data.records;
                }
            });
        this.getListUser();
    }

    getListUser() {
        this.fetchingData = true;
        const param = {
            ...this.filter,
            limit: this.limit,
            page: this.page
        }
        this.userService.getListUser(param)
            .pipe(
                this.unsubsribeOnDestroy,
                finalize(() => this.fetchingData = false)
            )
            .subscribe({
                next: (res: ApiResult<ListUserResult>) => {
                    this.totalRecords = res.data.total;
                    this.transformData(res.data.records)
                },
                error: (err) => {

                }
            });
    }

    transformData(data: User[]): void {
        this.employees = data.map(e => {
            return {
                id: e.userId,
                avatar: e.avatar,
                fullname: e.lastName + ' ' + e.firstName,
                email: e.email,
                phone: e.phone,
                role: e.userRole?.roleName,
                gender: e.genderId === 1 ? 'Nữ' : 'Nam',
                isActive: e.isActive,
                lastLogin: e.lastLogin
            }
        });
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getListUser();
    }

    openDialogCreate() {
        const dialogRef = this.dialogService.open(DialogCreateEmployeeComponent, {
            header: this.translate.instant('Add_employee'),
            width: '300px',
        });

        dialogRef.onClose
            .pipe(this.unsubsribeOnDestroy)
            .subscribe(
                (res) => {
                    if (res) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Regiter_successfully'),
                        });

                        this.getListUser();
                    }
                }
            );
    }

    openDialogPromoteRole(e: TableUser) {
        const dialogRef = this.dialogService.open(DialogPromoteRoleComponent, {
            header: e.fullname,
            width: '450px',
            data: e,
        });

        dialogRef.onClose
            .pipe(this.unsubsribeOnDestroy)
            .subscribe(
                (res) => {
                    if (res) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Promote_role_successfully'),
                        });

                        this.getListUser();
                    }
                }
            );
    }

    changeStateHandler(e: TableUser) {
        if (e.isActive) {
            this.userService.disableUser(e.id)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Deactive_successfully'),
                        });

                        this.getListUser();
                    },
                    error: (err) => {

                    }
                });
        } else {
            this.userService.activeUser(e.id)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Active_successfully'),
                        });

                        this.getListUser();
                    },
                    error: (err) => {

                    }
                });
        }
    }

    selectFileHandler(e) {
        const file = e.target.files[0];
        let reader: FileReader = new FileReader();

        reader.onload = (e) => {
            var workbook = XLSX.read(e.target.result, { type: 'binary' });
            var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            result.shift();
            this.bulkCreateEmployees(result);
        }
        reader.readAsBinaryString(file);
    }

    bulkCreateEmployees(data) {
        const param: User[] = data.map(e => {
            return {
                lastName: e[0],
                firstName: e[1],
                phone: e[2],
                genderId: e[3],
                email: e[4],
            }
        });

        this.userService.bulkCreateUser({ staffs: [...param] })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Create_customer_successfully'),
                        });
                        this.getListUser();
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

    changeFilter(e, name) {
        if (name === 'roleId') {
            this.filter[name] = e.toString();
        } else {
            this.filter[name] = e;
        }

        this.getListUser();
    }
}
