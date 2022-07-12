import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { FEE_TYPE } from 'src/app/core/consts/fee-type.const';
import { AdService } from 'src/app/core/models/ad-service.model';
import { Organization } from 'src/app/core/models/organization.model';
import { Project } from 'src/app/core/models/project.model';
import { User } from 'src/app/core/models/user.model';
import { CustomerService } from 'src/app/core/services/customer.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { AdServiceService } from 'src/app/core/services/service.service';
import { UserService } from 'src/app/core/services/user.service';
import * as moment from 'moment';
import { TabProjectService } from 'src/app/core/services/tab-project.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';
import { ReportService } from 'src/app/core/services/report.service';
import { BOOLEAN_SELECT } from 'src/app/core/consts/boolean-select.const';

@Component({
    selector: 'app-dialog-project',
    templateUrl: './dialog-project.component.html',
    styleUrls: ['./dialog-project.component.scss'],
})
export class DialogProjectComponent extends BaseClass implements OnInit {
    booleanSelect = BOOLEAN_SELECT.map(e => {
        return {
            value: e.value,
            label: this.translate.instant(e.label)
        }
    });
    customers: User[] = [];
    projects: Project[] = [];
    services: AdService[] = [];
    employees: User[] = [];
    rangeDates: Date[] = [];
    startDate: Date = new Date();
    dialogData = {
        customerId: 0,
        projectId: 0,
        hotline: '',
        description: '',
        feeType: 0,
        fixedRate: null,
        fixedAmount: null,
        customRate: '',
        startDate: '',
        isReceipt: false,
        taxRate: 0,
    };
    invalid: boolean = false;
    feeType = FEE_TYPE.map((e) => {
        return {
            ...e,
            label: this.translate.instant(e.label),
        };
    });

    constructor(
        private translate: TranslateService,
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private organizationService: OrganizationService,
        private customerService: CustomerService,
        private projectService: ProjectService,
        private reportService: ReportService,
        private userService: UserService,
        private tabProjectService: TabProjectService,
        private messageConfig: MessageConfigService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.dialogConfig.data?.campaignId) {
            this.startDate = new Date(this.dialogConfig.data.startDate);
            this.dialogData = {
                customerId: this.dialogConfig.data.customer?.userId,
                projectId: this.dialogConfig.data.project?.projectId,
                hotline: this.dialogConfig.data.hotline,
                description: this.dialogConfig.data.description,
                feeType: this.dialogConfig.data.feeType,
                fixedRate: this.dialogConfig.data.fixedRate * 100,
                fixedAmount: this.dialogConfig.data.fixedAmount,
                customRate: this.dialogConfig.data.customRate,
                isReceipt: this.dialogConfig.data.isReceipt,
                taxRate: this.dialogConfig.data.taxRate
                    ? this.dialogConfig.data.taxRate * 100
                    : 0,
                startDate: moment(this.startDate).format('YYYY-MM-DD'),
            };
        }

        this.reportService.selectedCustomers$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: User[]) => {
                    if (res?.length === 1) {
                        this.dialogData.customerId = res[0].userId;
                    }
                },
            });

        this.getInitData();
    }

    getInitData() {
        // const getOrganization = this.organizationService.getOrganizations({ page: 1, limit: 9999 });
        const getCustomers = this.customerService.getCustomers({
            page: 1,
            limit: 9999,
        });
        const getProjects = this.projectService.getProjects({
            page: 1,
            limit: 9999,
        });
        const getEmployees = this.userService.getListUser({
            limit: 99999,
            page: 1,
        });

        forkJoin([getCustomers, getProjects, getEmployees])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    // this.organizations = res[0].data.records;
                    this.customers = res[0].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: `${e.lastName} ${e.firstName} - ${e.phone}`,
                        };
                    });
                    this.projects = res[1].data.records;
                    this.employees = res[2].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        };
                    });
                },
            });
    }

    /**
     * @Create
     * New project for customer
     * @returns
     */
    create() {
        if (
            !this.dialogData.projectId ||
            !this.dialogData.customerId ||
            !this.dialogData.hotline
        ) {
            this.invalid = true;
            return;
        }

        for (const key in this.dialogData) {
            if (!this.dialogData[key]) {
                delete this.dialogData[key];
            }
        }

        if (this.dialogData.feeType === 1) {
            this.dialogData.fixedRate = this.dialogData.fixedRate / 100;
            delete this.dialogData.fixedAmount;
            delete this.dialogData.customRate;
            delete this.dialogData.startDate;
        } else if (this.dialogData.feeType === 2) {
            delete this.dialogData.fixedRate;
            delete this.dialogData.customRate;
        } else {
            delete this.dialogData.fixedAmount;
            delete this.dialogData.fixedRate;
            delete this.dialogData.startDate;
        }

        if (this.dialogData.isReceipt) {
            this.dialogData.taxRate = this.dialogData.taxRate / 100;
        }

        this.dialogData.startDate = moment(this.startDate).format('YYYY-MM-DD');

        this.tabProjectService
            .createProject(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: this.translate.instant(
                                'Add_project_to_customer_successfully'
                            ),
                        });

                        this.dialogRef.close(true);
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity:
                            err.error?.statusCode === 400
                                ? MESSAGE_TYPE.warn
                                : MESSAGE_TYPE.error,
                        summary:
                            err.error?.statusCode === 400
                                ? this.translate.instant(MESSAGE_SUMARY.warn)
                                : this.translate.instant(MESSAGE_SUMARY.error),
                        detail:
                            err.error?.message ??
                            this.translate.instant('Internal_server'),
                    });
                },
            });
    }

    update() {
        if (
            !this.dialogData.projectId ||
            !this.dialogData.customerId ||
            !this.dialogData.hotline
        ) {
            this.invalid = true;
            return;
        }

        for (const key in this.dialogData) {
            if (!this.dialogData[key]) {
                delete this.dialogData[key];
            }
        }

        if (this.dialogData.feeType === 1) {
            this.dialogData.fixedRate = this.dialogData.fixedRate / 100;
            delete this.dialogData.fixedAmount;
            delete this.dialogData.customRate;
            delete this.dialogData.startDate;
        } else if (this.dialogData.feeType === 2) {
            delete this.dialogData.fixedRate;
            delete this.dialogData.customRate;
        } else {
            delete this.dialogData.fixedAmount;
            delete this.dialogData.fixedRate;
            delete this.dialogData.startDate;
        }

        if (this.dialogData.isReceipt) {
            this.dialogData.taxRate = this.dialogData.taxRate / 100;
        }

        this.dialogData.startDate = moment(this.startDate).format('YYYY-MM-DD');

        const param = {
            ...this.dialogData,
            campaignId: this.dialogConfig.data.campaignId,
        };
        this.tabProjectService
            .updateProject(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: this.translate.instant(
                                'Update_project_to_customer_successfully'
                            ),
                        });

                        this.dialogRef.close(true);
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity:
                            err.error?.statusCode === 400
                                ? MESSAGE_TYPE.warn
                                : MESSAGE_TYPE.error,
                        summary:
                            err.error?.statusCode === 400
                                ? this.translate.instant(MESSAGE_SUMARY.warn)
                                : this.translate.instant(MESSAGE_SUMARY.error),
                        detail:
                            err.error?.message ??
                            this.translate.instant('Internal_server'),
                    });
                },
            });
    }
}
