import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { CampaignService } from 'src/app/core/models/campaign-services.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { User } from 'src/app/core/models/user.model';
import { CodeService } from 'src/app/core/services/code.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ReportService } from 'src/app/core/services/report.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-gen-code',
    templateUrl: './gen-code.component.html',
    styleUrls: ['./gen-code.component.scss']
})
export class GenCodeComponent extends BaseClass implements OnInit {
    data = {
        customerIds: [],
        projectIds: [],
        campaignIds: [],
        campaignServiceIds: [],
        expiresIn: 0
    }
    datePicker = new Date();
    customers: User[] = [];
    projects: Campaign[] = [];
    campaigns: CampaignService[] = [];


    constructor(
        private customerService: CustomerService,
        public config: DynamicDialogConfig,
        public dialogRef: DynamicDialogRef,
        private codeService: CodeService,
        private reportService: ReportService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.config.data) {
            this.getDetails();
        }
        this.getCustomer();
    }

    getDetails() {
        this.codeService.getDetails(this.config.data.codeId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs) => {
                    console.log(rs);
                }
            })
    }

    getCustomer() {
        this.customerService.getCustomers({ limit: 9999, page: 1 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<User[]>) => {
                    this.customers = rs.data.records.map(e => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        }
                    });
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    });
                }
            });
    }

    getProjects() {
        if (!this.data.customerIds.length) {
            this.projects = [];
            return;
        }
        const params = {
            limit: 9999,
            page: 1,
            customerIds: this.data.customerIds.toString(),
        }
        this.reportService.getProjects(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<Campaign[]>) => {
                    this.projects = rs.data.records.map(e => {
                        return {
                            ...e,
                            projectName: e.project.name + ' - ' + e.hotline
                        }
                    });
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    })
                }
            })
    }

    getCampaigns() {
        if (!this.data.projectIds.length) {
            this.campaigns = [];
            return;
        }
        const params = {
            limit: 9999,
            page: 1,
            projectIds: this.data.projectIds.toString(),
        }

        this.reportService.getCampaignAds(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<CampaignService[]>) => {
                    this.campaigns = rs.data.records
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    })
                }
            })
    }

    create() {
        const params = {
            customerIds: this.data.campaignIds.toString(),
            projectIds: this.data.projectIds.toString(),
            campaignIds: this.data.campaignIds.toString(),
            campaignServiceIds: this.data.campaignServiceIds.toString(),
            expiresIn: moment(this.datePicker).valueOf() - moment(new Date()).valueOf(),
        }

        this.codeService.createCode(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs) => {
                    if (rs.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Create_code_successfully'),
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