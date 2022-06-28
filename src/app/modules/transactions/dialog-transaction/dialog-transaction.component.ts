import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { Organization } from 'src/app/core/models/organization.model';
import { CustomerService } from 'src/app/core/services/customer.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import * as moment from 'moment';
import { CampaignService } from 'src/app/core/services/campaign.service';
import { Campaign } from 'src/app/core/models/campaign.model';
import { MessageConfigService } from 'src/app/service/message.config.service';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';

@Component({
    selector: 'app-dialog-transaction',
    templateUrl: './dialog-transaction.component.html',
    styleUrls: ['./dialog-transaction.component.scss'],
})
export class DialogTransactionComponent extends BaseClass implements OnInit {
    dialogData = {
        organizationId: null,
        customerId: 0,
        campaignId: 0,
        amount: null,
        note: '',
        paymentType: 1,
        paymentDate: '',
    };

    paymentType = [
        { name: this.translate.instant('Received'), code: 1 },
        { name: this.translate.instant('Refund'), code: 2 },
    ];

    organizations: Organization[] = [];
    customers: User[] = [];
    campaigns: Campaign[] = [];
    campaignPayments = [];
    invalid: boolean = false;

    constructor(
        private transactionService: TransactionService,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private translate: TranslateService,
        private organizationService: OrganizationService,
        private customerService: CustomerService,
        private campaignService: CampaignService,
        private messageConfig: MessageConfigService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getDataFirst();
        if (this.config.data) {
            console.log(this.config.data);
            this.dialogData = {
                ...this.config.data,
                customerId: this.config.data.customer.userId,
                campaignId: this.config.data.campaign.campaignId,
                paymentDate: new Date(this.config.data.paymentDate),
            };

            this.changeCustomer(this.config.data.customer.userId);
        }
    }

    getDataFirst() {
        const getOrganizations = this.organizationService.getOrganizations({
            limit: 9999,
            page: 1,
        });
        const getCustomers = this.customerService.getCustomers({});

        forkJoin([getOrganizations, getCustomers])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.organizations = res[0].data.records;
                    this.customers = res[1].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: `${e.lastName} ${e.firstName} - ${e.phone}`,
                        };
                    });
                },
                error: (err) => {},
            });
    }

    changeOrganization(e) {
        const param = {
            organizationIds: e.toString(),
        };
        this.customerService
            .getCustomers(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.customers = res.data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: `${e.lastName} ${e.firstName} - ${e.phone}`,
                        };
                    });
                    if (
                        this.customers.find(
                            (e) => e.userId === this.dialogData.customerId
                        )
                    ) {
                        this.changeCustomer(this.dialogData.customerId);
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    changeCustomer(e) {
        const param = {
            customerIds: e.toString(),
            organizationIds: this.dialogData.organizationId?.toString(),
        };
        this.campaignService
            .getCampaigns(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.campaigns = res.data.records.map((e: Campaign) => {
                        return {
                            ...e,
                            projectName: `${e.project.name} - ${e.hotline}`,
                        };
                    });
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    addPayment() {
        const params = {
            ...this.dialogData,
            paymentDate: moment(this.dialogData.paymentDate).format(
                'YYYY-MM-DD'
            ),
        };
        console.log(params);
    }

    createPayments() {
        if (
            !this.dialogData.customerId ||
            !this.dialogData.campaignId ||
            !this.dialogData.amount ||
            !this.dialogData.paymentDate
        ) {
            this.invalid = true;
            return;
        }

        this.invalid = false;

        const params = {
            ...this.dialogData,
            paymentDate: moment(this.dialogData.paymentDate).format(
                'YYYY-MM-DD'
            ),
        };

        this.transactionService
            .createTransaction({ campaignPayments: [params] })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant(
                            'Create_transaction_successfully'
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
            !this.dialogData.customerId ||
            !this.dialogData.campaignId ||
            !this.dialogData.amount ||
            !this.dialogData.paymentDate
        ) {
            this.invalid = true;
            return;
        }

        this.invalid = false;

        const params = {
            ...this.dialogData,
            paymentDate: moment(this.dialogData.paymentDate).format(
                'YYYY-MM-DD'
            ),
            campaignPaymentId: this.config.data.campaignPaymentId,
        };

        this.transactionService
            .updateTransaction(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant(
                            'Update_transaction_successfully'
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
