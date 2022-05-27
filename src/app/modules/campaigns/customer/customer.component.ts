import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem, SortEvent } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { CampaignFilter, CampaignSort } from 'src/app/core/models/campaign-filter.model';
import { User } from 'src/app/core/models/user.model';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ReportService } from 'src/app/core/services/report.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogCustomerComponent } from '../dialog-customer/dialog-customer.component';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { Organization } from 'src/app/core/models/organization.model';
import { UserService } from 'src/app/core/services/user.service';
@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    providers: [ConfirmationService, DialogService]
})
export class CustomerComponent extends BaseClass implements OnInit, OnChanges {

    @ViewChild('file', { static: false }) file: ElementRef;
    @ViewChild('template', { static: false }) template: ElementRef;
    @Input() organizationsInput: Organization[];
    @Input() customersInput: User[];
    @Input() customerName: string;
    @Output() tabIndex = new EventEmitter<number>();
    items: MenuItem[];
    customers: User[] = [];
    fetchingData: boolean = false;
    selectedOrganizations: Organization[] = [];
    selectedCustomers: User[] = [];
    total = {
        totalAccountingAmount: 0,
        totalExpenditureAmount: 0,
        totalFeeAmount: 0,
        totalTransactionAmount: 0,
        totalAnotherServiceFee: 0,
    }
    dateFilter: Date[] = [];
    campaignFilter: CampaignFilter = {};
    actions: number[] = [];
    sort: CampaignSort = {};
    constructor(
        private reportService: ReportService,
        private customerService: CustomerService,
        private confirmationService: ConfirmationService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private dialogService: DialogService,
        private router: Router,
        private userService: UserService
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['organizationsInput']) {
            this.selectedOrganizations = changes.organizationsInput.currentValue;
        }

        if (changes['customersInput']) {
            this.selectedCustomers = changes.customersInput.currentValue;
        }

        if (changes['customerName']) {
            this.reportService.campaignFilter$.value.customerNameStr = changes['customerName'].currentValue;
            this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
        }
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

        this.reportService.dateFilter$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.reportService.campaignFilter$.value.fromDate = res[0] ? moment(res[0]).format('YYYY-MM-DD') : '';
                    this.reportService.campaignFilter$.value.toDate = res[1] ? moment(res[1]).format('YYYY-MM-DD') : '';
                    this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
                }
            })

        this.reportService.campaignFilter$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.campaignFilter = {
                        ...res,
                        organizationIds: this.selectedOrganizations.map(e => e.organizationId).toString(),
                    };
                    this.getCustomers();
                }
            })
    }

    getCustomers() {
        this.fetchingData = true;
        this.campaignFilter.page = this.page;
        this.campaignFilter.limit = this.limit;
        delete this.campaignFilter.customerIds;
        delete this.campaignFilter.projectIds;

        const params = {
            ...this.campaignFilter,
            sort: { ...this.sort },
        }

        this.reportService.getCustomers(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.fetchingData = false;
                    this.total = { ...res.data.statistical };
                    this.totalRecords = res.data.total;
                    this.transformData(res.data.records);
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

    transformData(data: User[]) {
        this.customers = data.map(e => {
            return {
                ...e,
                customerName: e.lastName + ' ' + e.firstName,
            }
        })
    }

    selectionChange() {
        this.reportService.selectedCustomers$.next(this.selectedCustomers);
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getCustomers();
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.target,
            message: this.translate.instant('Are_you_sure_that_you_want_to_proceed'),
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteSelectedCustomers()
            },
            reject: () => {
                //reject action
            }
        });
    }

    deleteSelectedCustomers() {
        const ids = this.selectedCustomers.map(e => e.userId);

        this.customerService.deleteCustomer(ids)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.selectedCustomers = [];
                        this.getCustomers();
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

    delete(e: User) {
        this.customerService.deleteCustomer(e.userId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.selectedCustomers = [];
                        this.getCustomers();
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

    openDialog(e?, method?) {
        const dialogRef = this.dialogService.open(DialogCustomerComponent, {
            header: method ? this.translate.instant('Detail_customer') : (!e ? this.translate.instant('Add_customer') : this.translate.instant('Update_customer')),
            width: '400px',
            data: {
                ...e,
                method: method
            }
        });

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getCustomers();
                }
            }
        })
    }

    selectFileHandler(e) {
        const file = e.files[0];
        let reader: FileReader = new FileReader();

        reader.onload = (e) => {
            var workbook = XLSX.read(e.target.result, { type: 'binary' });
            var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            result.shift();
            this.bulkCreateCustomer(result);
        }
        reader.readAsBinaryString(file);
    }

    bulkCreateCustomer(data) {
        const param: User[] = data.map(e => {
            return {
                lastName: e[0],
                firstName: e[1],
                customerType: e[2],
                phone: e[3],
                genderId: e[4],
                email: e[5],
                feeRate: e[6],
                businessStaffId: e[7]
            }
        });

        this.customerService.bulkCreateCustomer({ customers: [...param] })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Create_customer_successfully'),
                        });
                        this.getCustomers();
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

    getColor(e: string) {
        let color = 'unset';
        if (e === 'Kém' || e === 'Rất kém') {
            color = 'red'
        } else if (e === 'Đạt yêu cầu') {
            color = 'blue'
        } else if (e === 'Tốt' || e === 'Xuất sắc') {
            color = 'green';
        }
        return color;
    }

    customerClicked(e: User) {
        this.selectedCustomers = [];
        this.selectedCustomers.push(e);
        this.reportService.selectedCustomers$.next(this.selectedCustomers);
        this.tabIndex.emit(2);
    }

    sortCustomer(e: SortEvent) {
        this.sort = {};
        if (e.order === 1) {
            this.sort[e.field] = 'DESC';
        } else {
            this.sort[e.field] = 'ASC';
        }
        this.getCustomers();
    }
}
