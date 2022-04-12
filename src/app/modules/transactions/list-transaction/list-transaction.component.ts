import { Component, OnInit } from '@angular/core';
import { BaseClass } from 'src/app/core/base/base.class';
import { Transaction } from 'src/app/core/models/transaction.model';
import { TransactionService } from 'src/app/core/services/transaction.service';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogTransactionComponent } from '../dialog-transaction/dialog-transaction.component';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, pipe } from 'rxjs';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-list-transaction',
    templateUrl: './list-transaction.component.html',
    styleUrls: ['./list-transaction.component.scss'],
    providers: [DialogService]
})
export class ListTransactionComponent extends BaseClass implements OnInit {

    transactions: Transaction[] = []
    fetchingData: boolean = false;
    dateFilter: Date[] = [];
    transactionType = [
        { value: 1, label: this.translate.instant('Received') },
        { value: 2, label: this.translate.instant('Refund') }
    ]
    filterTransactions = {
        customerName: '',
        hotline: '',
        paymentType: null,
        fromDate: '',
        toDate: '',
        limit: 0,
        page: 0
    };
    actions: number[] = [];
    constructor(
        private transactionService: TransactionService,
        private dialogService: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private userService: UserService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.getTransactions();
    }

    getTransactions() {
        this.fetchingData = true;

        this.filterTransactions.limit = this.limit;
        this.filterTransactions.page = this.page;
        this.filterTransactions.fromDate = this.dateFilter[0] ? moment(this.dateFilter[0]).format('YYYY/MM/DD') : '',
            this.filterTransactions.toDate = this.dateFilter[1] ? moment(this.dateFilter[1]).format('YYYY/MM/DD') : '',

            this.transactionService.getTransactions(this.filterTransactions)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res: ApiPagingResult<Transaction[]>) => {
                        this.fetchingData = false;
                        this.transformData(res.data.records);
                        this.totalRecords = res.data.total;
                    },
                    error: (err) => {
                        this.fetchingData = false;
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.error,
                            summary: this.translate.instant(MESSAGE_SUMARY.error),
                            detail: this.translate.instant('Internal_server'),
                        })
                    }
                })
    }

    transformData(data: Transaction[]) {
        this.transactions = data.map(e => {
            return {
                ...e,
                customerName: e.customer.lastName + ' ' + e.customer.firstName,
                phone: e.customer.phone,
                hotline: e.campaign.hotline,
                campaignDescription: e.campaign.description,
                createdByName: e.createdBy.lastName + ' ' + e.createdBy.firstName,
                transactionDate: moment(e.paymentDate).format('DD/MM/YYYY'),
                transactionUtcDate: moment(e.paymentDate).format(),
                createdDate: moment(e.createdUtcDate).format('DD/MM/YYYY')
            }
        });
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getTransactions();
    }

    selectDate(e: number) {
        let startDate = new Date(new Date().setHours(0, 0, 0, 0));
        let endDate = new Date(new Date().setHours(23, 59, 59, 0));
        switch (e) {
            case 1:
                this.dateFilter = [startDate, endDate];
                break;
            case 2:
                startDate = new Date(new Date(new Date().setDate(startDate.getDate() - 1)).setHours(0, 0, 0, 0));
                endDate = new Date(new Date(new Date().setDate(endDate.getDate() - 1)).setHours(23, 59, 59, 0));
                this.dateFilter = [startDate, endDate];
                break;
            case 3:
                startDate = new Date(new Date(new Date().setDate(startDate.getDate() - 6)).setHours(0, 0, 0, 0));
                this.dateFilter = [startDate, endDate];
                break;
            case 4:
                startDate = new Date(new Date(new Date().setDate(startDate.getDate() - 29)).setHours(0, 0, 0, 0));
                this.dateFilter = [startDate, endDate];
                break;
            case 5:
                startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                this.dateFilter = [startDate, endDate];
                break;
            case 6:
                if (new Date().getMonth() == 0) {
                    startDate = new Date(new Date().getFullYear() - 1, 11, 1);
                    endDate = new Date(new Date().getFullYear() - 1, 11, 31);
                } else {
                    startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                    endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
                }
                this.dateFilter = [startDate, endDate];
                break;
            default:
                break;
        }

        this.getTransactions();
    }

    dateFilterChange(e: Date[]) {
        if (e.length === 2 && e[0] && e[1]) {
            this.getTransactions();
        }
    }

    clearDate() {
        this.dateFilter = [];
        this.getTransactions();
    }

    changeCustomerName(e) {
        this.filterTransactions.customerName = e;
        this.getTransactions();
    }

    changeHotline(e) {
        this.filterTransactions.hotline = e;
        this.getTransactions();
    }

    changeTransactionType(e) {
        this.filterTransactions.paymentType = e;
        this.getTransactions();
    }

    openDialog(e?: Transaction) {
        const dialogRef = this.dialogService.open(DialogTransactionComponent, {
            header: !e ? this.translate.instant('Add_transaction') : this.translate.instant('Update_transaction'),
            data: e,
            width: '350px'
        })

        dialogRef.onClose.subscribe({
            next: (res: boolean) => {
                if (res) {
                    this.getTransactions();
                }
            }
        })
    }

    delete(e: Transaction) {
        this.transactionService.deleteTransaction(e.campaignPaymentId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: res.data.message,
                    });
                    this.getTransactions();
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
