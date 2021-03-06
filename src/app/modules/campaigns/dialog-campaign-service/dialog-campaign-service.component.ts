import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { AdService } from 'src/app/core/models/ad-service.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { User } from 'src/app/core/models/user.model';
import { CampaignService } from 'src/app/core/services/campaign.service';
import { AdServiceService } from 'src/app/core/services/service.service';
import { UserService } from 'src/app/core/services/user.service';
import * as moment from 'moment';
import { CampaignServicesService } from 'src/app/core/services/campaign-services.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { TranslateService } from '@ngx-translate/core';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';
import { ReportService } from 'src/app/core/services/report.service';
import { CustomerService } from 'src/app/core/services/customer.service';

@Component({
    selector: 'app-dialog-campaign-service',
    templateUrl: './dialog-campaign-service.component.html',
    styleUrls: ['./dialog-campaign-service.component.scss'],
})
export class DialogCampaignServiceComponent
    extends BaseClass
    implements OnInit
{
    startDate: Date = new Date();
    dialogData = {
        name: '',
        customerId: 0,
        campaignId: 0,
        serviceId: 0,
        adAccount: '',
        staffIds: [],
        goal: null,
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
    };
    invalid: boolean = false;
    filterCampaigns: Campaign[] = [];
    campaigns: Campaign[] = [];
    services: AdService[] = [];
    employees: User[] = [];
    customers: User[] = [];

    constructor(
        private campaignService: CampaignService,
        private adServiceService: AdServiceService,
        private userService: UserService,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private campaignServicesService: CampaignServicesService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        private reportService: ReportService,
        private customerService: CustomerService
    ) {
        super();
    }

    ngOnInit(): void {
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

        this.reportService.selectedProjects$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: Campaign[]) => {
                    if (res?.length === 1) {
                        this.dialogData.campaignId = res[0].campaignId;
                    }
                },
            });
        this.getInitialData();

        if (this.config.data?.campaignServiceId) {
            this.dialogData = {
                name: this.config.data.name,
                customerId: this.config.data.campaign.customer.userId,
                campaignId: this.config.data.campaign.campaignId,
                serviceId: this.config.data.service.serviceId,
                adAccount: this.config.data.adAccount,
                staffIds: this.config.data.staffs.map((e: User) => e?.userId),
                goal: this.config.data.goal,
                description: this.config.data.description,
                startDate: '',
                endDate: '',
                isActive: this.config.data.isActive,
            };
            this.startDate = new Date(
                moment(this.config.data.startDate, 'DD/MM/YYYY').format(
                    'MM/DD/YYYY'
                )
            );
            // this.dateRange = [
            //     new Date(moment(this.config.data.startDate, 'DD/MM/YYYY').format('MM/DD/YYYY')),
            //     new Date(moment(this.config.data.endDate, 'DD/MM/YYYY').format('MM/DD/YYYY'))
            // ];
        }
    }

    getInitialData() {
        // const getCampaign = this.reportService.getListProjects({
        //     limit: 99999,
        //     page: 1,
        // });
        const getAdService = this.adServiceService.getAllService({
            limit: 99999,
            page: 1,
            serviceTypeId: 1,
        });
        const getEmployees = this.userService.getListUser({
            limit: 99999,
            page: 1,
        });
        const getCustomers = this.customerService.getCustomers({
            limit: 99999,
            page: 1,
        });

        forkJoin([getAdService, getEmployees, getCustomers])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.services = res[0].data.records
                        .map((e: AdService) => {
                            return {
                                ...e,
                                isChildren: e.parentId ? true : false,
                                parentId: e.parentId ?? e.serviceId,
                            };
                        })
                        .sort(
                            (a: AdService, b: AdService) =>
                                a.serviceId - b.serviceId
                        )
                        .sort(
                            (a: AdService, b: AdService) =>
                                a.parentId - b.parentId
                        );
                    this.employees = res[1].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: `${e.lastName} ${e.firstName} ${
                                e.department ? '- ' + e.department?.name : ''
                            }`,
                        };
                    });

                    this.customers = res[2].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: `${e.lastName} ${e.firstName} - ${e.phone}`,
                        };
                    });
                },
                complete: () => {
                    if (this.dialogData.customerId) {
                        this.changeCustomer(this.dialogData.customerId);
                    }
                },
            });
    }

    changeCustomer(id) {
        this.reportService
            .getListProjects({
                limit: 99999,
                page: 1,
                customerIds: id.toString(),
            })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs) => {
                    this.campaigns = rs.data.records.map((e: Campaign) => {
                        return {
                            ...e,
                            projectName: `${e.project.name} - ${e.hotline}`,
                        };
                    });
                    this.filterCampaigns = [...this.campaigns];
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    });
                },
            });
    }

    create() {
        if (
            !this.dialogData.name ||
            !this.dialogData.customerId ||
            !this.startDate ||
            !this.dialogData.campaignId ||
            !this.dialogData.serviceId ||
            !this.dialogData.staffIds.length ||
            !this.dialogData.goal
        ) {
            this.invalid = true;
            return;
        }

        this.dialogData.startDate = moment(this.startDate).format('YYYY-MM-DD');

        for (const key in this.dialogData) {
            if (!this.dialogData[key]) {
                delete this.dialogData[key];
            }
        }

        const params = {
            ...this.dialogData,
            staffIds: this.dialogData.staffIds.toString(),
        };

        this.campaignServicesService
            .createCampaignService(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant(
                            'Create_campaign_service_successfully'
                        ),
                    });

                    this.dialogRef.close(true);
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
            !this.dialogData.name ||
            !this.dialogData.customerId ||
            !this.startDate ||
            !this.dialogData.campaignId ||
            !this.dialogData.serviceId
        ) {
            this.invalid = true;
            return;
        }

        this.dialogData.startDate = moment(this.startDate).format('YYYY-MM-DD');

        for (const key in this.dialogData) {
            if (!this.dialogData[key] && key !== 'isActive') {
                delete this.dialogData[key];
            }
        }

        const param = {
            ...this.dialogData,
            campaignServiceId: this.config.data.campaignServiceId,
            staffIds: this.dialogData.staffIds.toString(),
        };

        this.campaignServicesService
            .updateCampaignService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant(
                            'Update_campaign_service_successfully'
                        ),
                    });

                    this.dialogRef.close(true);
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
