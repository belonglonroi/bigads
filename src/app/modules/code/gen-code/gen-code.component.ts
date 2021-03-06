import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';
import {
    ApiPagingResult,
    ApiResult,
} from 'src/app/core/models/api-result.model';
import { CampaignService } from 'src/app/core/models/campaign-services.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { Code } from 'src/app/core/models/code.model';
import { Organization } from 'src/app/core/models/organization.model';
import { User } from 'src/app/core/models/user.model';
import { CampaignServicesService } from 'src/app/core/services/campaign-services.service';
import { CampaignService as CampService } from 'src/app/core/services/campaign.service';
import { CodeService } from 'src/app/core/services/code.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { ReportService } from 'src/app/core/services/report.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-gen-code',
    templateUrl: './gen-code.component.html',
    styleUrls: ['./gen-code.component.scss'],
})
export class GenCodeComponent extends BaseClass implements OnInit {
    data = {
        name: '',
        organizationIds: [],
        customerIds: [],
        campaignIds: [],
        campaignServiceIds: [],
        expiresIn: 0,
    };
    datePicker = new Date(new Date().setHours(0, 0, 0, 0));
    organizations: Organization[] = [];
    customers: User[] = [];
    projects: Campaign[] = [];
    campaigns: CampaignService[] = [];
    isLoading: boolean = true;

    constructor(
        private customerService: CustomerService,
        public config: DynamicDialogConfig,
        public dialogRef: DynamicDialogRef,
        private codeService: CodeService,
        private reportService: ReportService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        private organizationService: OrganizationService,
        private campaignService: CampService
    ) {
        super();
    }

    ngOnInit(): void {
        this.isLoading = true;

        if (this.config.data) {
            this.getDetails();
        } else {
            this.initialData();
        }
    }

    getDetails() {
        this.isLoading = true;
        this.codeService
            .getDetails(this.config.data.codeId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiResult<Code>) => {
                    this.data = {
                        name: rs.data.name,
                        organizationIds: rs.data.oraginzations.map(
                            (e: Organization) => e.organizationId
                        ),
                        customerIds: rs.data.customers.map(
                            (e: User) => e.userId
                        ),
                        campaignIds: rs.data.campaigns.map(
                            (e: Campaign) => e.campaignId
                        ),
                        campaignServiceIds: rs.data.campaignServices.map(
                            (e) => e.campaignServiceId
                        ),
                        expiresIn: rs.data.expireAt,
                    };
                    this.datePicker = new Date(rs.data.expireAt);
                    this.isLoading = false;
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    });
                },
                complete: () => {
                    this.initialData();
                },
            });
    }

    initialData() {
        const getOrganizations = this.organizationService.getOrganizations({
            page: 1,
            limit: 99999,
        });
        const getCustomers = this.customerService.getCustomers({
            page: 1,
            limit: 99999,
            organizationIds: this.data.organizationIds.toString() ?? '',
        });

        forkJoin([getOrganizations, getCustomers])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (
                    rs: [
                        ApiPagingResult<Organization[]>,
                        ApiPagingResult<User[]>
                    ]
                ) => {
                    this.organizations = rs[0].data.records;

                    this.customers = rs[1].data.records.map((e) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        };
                    });

                    this.isLoading = false;
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    });
                },
                complete: () => {
                    if (this.config.data && this.data.customerIds.length) {
                        this.getProjects();
                        if (this.data.campaignIds.length) {
                            this.getCampaigns();
                        }
                    }
                },
            });
    }

    getCustomer() {
        if (!this.data.organizationIds.length) {
            this.data.customerIds = [];
        }
        this.isLoading = true;
        this.customerService
            .getCustomers({
                limit: 9999,
                page: 1,
                organizationIds: this.data.organizationIds.toString() ?? '',
            })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<User[]>) => {
                    this.customers = rs.data.records.map((e) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        };
                    });
                    if (this.data.customerIds.length) {
                        this.getProjects();
                    } else {
                        this.isLoading = false;
                    }
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

    getProjects() {
        if (!this.data.customerIds.length) {
            this.projects = [];
            this.data.campaignIds = [];
            return;
        }
        this.isLoading = true;
        const params = {
            limit: 9999,
            page: 1,
            customerIds: this.data.customerIds.toString(),
        };
        this.campaignService
            .getCampaigns(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<Campaign[]>) => {
                    this.projects = rs.data.records.map((e) => {
                        return {
                            ...e,
                            projectName: e.project.name + ' - ' + e.hotline,
                        };
                    });
                    if (this.data.campaignIds.length) {
                        this.getCampaigns();
                    } else {
                        this.isLoading = false;
                    }
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

    getCampaigns() {
        if (!this.data.campaignIds.length) {
            this.campaigns = [];
            this.data.campaignServiceIds = [];
            return;
        }
        this.isLoading = true;
        const params = {
            limit: 9999,
            page: 1,
            campaignIds: this.data.campaignIds.toString(),
        };

        this.campaignService
            .getCampaignServices(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<CampaignService[]>) => {
                    this.campaigns = rs.data.records;
                    this.isLoading = false;
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
        const params = {
            name: this.data.name,
            organizationIds: this.data.organizationIds.toString(),
            customerIds: this.data.customerIds.toString(),
            projectIds: '',
            campaignIds: this.data.campaignIds.toString(),
            campaignServiceIds: this.data.campaignServiceIds.toString(),
            expiresIn:
                moment(this.datePicker).valueOf() -
                moment(new Date()).valueOf(),
        };

        this.codeService
            .createCode(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs) => {
                    if (rs.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: this.translate.instant(
                                'Create_code_successfully'
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
        const params = {
            codeId: this.config.data.codeId,
            name: this.data.name,
            organizationIds: this.data.organizationIds.toString(),
            customerIds: this.data.customerIds.toString(),
            projectIds: '',
            campaignIds: this.data.campaignIds.toString(),
            campaignServiceIds: this.data.campaignServiceIds.toString(),
            expiresIn:
                moment(this.datePicker).valueOf() -
                moment(new Date()).valueOf(),
        };

        this.codeService
            .updateCode(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs) => {
                    if (rs.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: this.translate.instant(
                                'Update_code_successfully'
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

    selectDate(e: number) {
        const now = new Date();
        switch (e) {
            case 1:
                this.datePicker = new Date(
                    new Date(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        now.getDate()
                    ).setHours(23, 59, 59, 99)
                );
                break;
            case 3:
                this.datePicker = new Date(
                    new Date(
                        now.getFullYear(),
                        now.getMonth() + 3,
                        now.getDate()
                    ).setHours(23, 59, 59, 99)
                );
                break;
            case 6:
                this.datePicker = new Date(
                    new Date(
                        now.getFullYear(),
                        now.getMonth() + 6,
                        now.getDate()
                    ).setHours(23, 59, 59, 99)
                );
                break;
            case 12:
                this.datePicker = new Date(
                    new Date(
                        now.getFullYear(),
                        now.getMonth() + 12,
                        now.getDate()
                    ).setHours(23, 59, 59, 99)
                );
                break;
            default:
                break;
        }
    }
}
