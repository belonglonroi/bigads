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
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
    selector: 'app-dialog-project',
    templateUrl: './dialog-project.component.html',
    styleUrls: ['./dialog-project.component.scss']
})
export class DialogProjectComponent extends BaseClass implements OnInit {

    organizations: Organization[] = [];
    customers: User[] = [];
    projects: Project[] = [];
    services: AdService[] = [];
    employees: User[] = [];
    rangeDates: Date[] = [];
    startDate: Date = new Date();
    dialogData = {
        oraginzationId: 0,
        customerId: 0,
        projectId: 0,
        hotline: '',
        // goal: '',
        description: '',
        // dailyPayment: 0,
        feeType: 0,
        fixedRate: null,
        fixedAmount: null,
        customRate: '',
        startDate: '',
    }
    invalid: boolean = false;
    feeType = FEE_TYPE.map(e => {
        return {
            ...e,
            label: this.translate.instant(e.label)
        }
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
        private messageConfig: MessageConfigService,
    ) {
        super();
    }

    ngOnInit(): void {

        if (this.dialogConfig.data?.campaignId) {
            this.startDate = new Date(this.dialogConfig.data.startDate);
            this.dialogData = {
                oraginzationId: this.dialogConfig.data.oraginzation?.organizationId,
                customerId: this.dialogConfig.data.customer?.userId,
                projectId: this.dialogConfig.data.project?.projectId,
                hotline: this.dialogConfig.data.hotline,
                // goal: '',
                description: this.dialogConfig.data.description,
                // dailyPayment: 0,
                feeType: this.dialogConfig.data.feeType,
                fixedRate: this.dialogConfig.data.fixedRate * 100,
                fixedAmount: this.dialogConfig.data.fixedAmount,
                customRate: this.dialogConfig.data.customRate,
                startDate: moment(this.startDate).format('YYYY-MM-DD')
            }
        }

        this.reportService.selectedCustomers$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: User[]) => {
                    if (res?.length === 1) {
                        this.dialogData.customerId = res[0].userId;
                    }
                }
            })

        this.getInitData();
    }

    getInitData() {
        const getOrganization = this.organizationService.getOrganizations({ page: 1, limit: 9999 });
        const getCustomers = this.customerService.getCustomers({ page: 1, limit: 9999 });
        const getProjects = this.projectService.getProjects({ page: 1, limit: 9999 });
        const getEmployees = this.userService.getListUser({ limit: 99999, page: 1 });

        forkJoin([getOrganization, getCustomers, getProjects, getEmployees])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.organizations = res[0].data.records;
                    this.customers = res[1].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: `${e.lastName} ${e.firstName} - ${e.phone}`,
                        }
                    });
                    this.projects = res[2].data.records;
                    this.employees = res[3].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        }
                    });

                }
            })
    }

    organizationChange(e: number) {
        const param = {
            limit: 99999,
            page: 1,
            organizationIds: e.toString(),
        }
        this.customerService.getCustomers(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.customers = res.data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        }
                    });;
                }
            })
    }

    create() {
        if (!this.dialogData.projectId || !this.dialogData.customerId || !this.dialogData.hotline) {
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

        this.dialogData.startDate = moment(this.startDate).format('YYYY-MM-DD')

        this.tabProjectService.createProject(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Add_project_to_customer_successfully'),
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
    }

    update() {
        if (!this.dialogData.projectId || !this.dialogData.customerId || !this.dialogData.hotline) {
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

        this.dialogData.startDate = moment(this.startDate).format('YYYY-MM-DD')

        const param = {
            ...this.dialogData,
            campaignId: this.dialogConfig.data.campaignId,
        }
        this.tabProjectService.updateProject(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Update_project_to_customer_successfully'),
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
    }
}
