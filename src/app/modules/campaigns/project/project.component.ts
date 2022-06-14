import { DialogExtendComponent } from './../dialog-extend/dialog-extend.component';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { BaseClass } from 'src/app/core/base/base.class';
import { Campaign } from 'src/app/core/models/campaign.model';
import { User } from 'src/app/core/models/user.model';
import { ReportService } from 'src/app/core/services/report.service';
import * as moment from 'moment';
import { CampaignFilter, CampaignSort } from 'src/app/core/models/campaign-filter.model';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogProjectComponent } from '../dialog-project/dialog-project.component';
import { MESSAGE_SUMARY, MESSAGE_TYPE } from 'src/app/core/consts/message.const';
import { TabProjectService } from 'src/app/core/services/tab-project.service';
import { UserService } from 'src/app/core/services/user.service';
@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    providers: [ConfirmationService, DialogService]
})
export class ProjectComponent extends BaseClass implements OnInit, OnChanges {

    @Input() customerName: string;
    @Output() tabIndex = new EventEmitter<number>();
    projects: Campaign[] = [];
    fetchingData: boolean = false;
    selectedProjects: Campaign[] = [];
    total = {
        totalAccountingAmount: 0,
        totalExpenditureAmount: 0,
        totalFeeAmount: 0,
        totalTransactionAmount: 0,
        totalAnotherServiceFee: 0,
    };
    campaignFilter: CampaignFilter = {};
    actions: number[] = [];
    sort: CampaignSort = {};
    code: string = '';

    constructor(
        private reportService: ReportService,
        private confirmationService: ConfirmationService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private dialogService: DialogService,
        private tabProjectService: TabProjectService,
        private userService: UserService,
    ) {
        super();
        this.code = reportService.code;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['customerName']) {
            this.reportService.campaignFilter$.value.customerNameStr = changes['customerName'].currentValue;
            this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
        }
    }

    ngOnInit(): void {
        this.actions = this.userService.action ?? [];

        if(this.code) {
            this.sort = {
                expenditureAmount: 'DESC'
            }
        }

        this.reportService.selectedProjects$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.selectedProjects = res;
                }
            });

        this.reportService.dateFilter$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.reportService.campaignFilter$.value.fromDate = res[0] ? moment(res[0]).format('YYYY-MM-DD') : '';
                    this.reportService.campaignFilter$.value.toDate = res[1] ? moment(res[1]).format('YYYY-MM-DD') : '';
                    this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
                }
            })

        this.reportService.selectedCustomers$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: User[]) => {
                    this.reportService.campaignFilter$.value.customerIds = res.map(e => e.userId).toString();
                    this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
                }
            })

        this.reportService.campaignFilter$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.campaignFilter = { ...res };
                    this.getProjects();
                }
            })

    }

    getProjects() {
        this.fetchingData = true;
        this.campaignFilter.page = this.page;
        this.campaignFilter.limit = this.limit;
        delete this.campaignFilter.campaignIds;

        const params = {
            ...this.campaignFilter,
            sort: { ...this.sort },
        }

        this.reportService.getProjects(params)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.fetchingData = false;
                    this.total = { ...res.data.statistical };
                    this.totalRecords = res.data.total;
                    this.transformData(res.data.records);
                },
                error: (err) => {
                    console.log(err)
                }
            })
    }

    transformData(data: Campaign[]) {
        this.projects = data.map(e => {
            return {
                ...e,
                projectName: e.project.name,
                customerName: e.customer.lastName + ' ' + e.customer.firstName,
                category: e.project.category?.name
            }
        });
    }

    selectionChange() {
        this.reportService.selectedProjects$.next(this.selectedProjects);
    }

    changePage(e) {
        this.page = e.page + 1;
        this.limit = e.rows;
        this.getProjects();
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.target,
            message: this.translate.instant('Are_you_sure_that_you_want_to_proceed'),
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteSelectedProjects()
            },
            reject: () => {
                //reject action
            }
        });
    }

    deleteSelectedProjects() {
        const ids = this.selectedProjects.map(e => e.campaignId);

        this.tabProjectService.deleteProjects(ids)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.selectedProjects = [];
                        this.reportService.selectedProjects$.next([]);
                        this.getProjects();
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

    delete(e: Campaign) {
        this.tabProjectService.deleteProjects(e.campaignId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.selectedProjects = [];
                        this.getProjects();
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

    openDialog(e?: Campaign, method?: string) {
        const dialogRef = this.dialogService.open(DialogProjectComponent, {
            header: method ? this.translate.instant('Detail_project') : this.translate.instant('Add_project'),
            width: '450px',
            data: {
                ...e,
                method: method
            }
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getProjects();
                }
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

    projectClicked(e: Campaign) {
        this.selectedProjects = [];
        this.selectedProjects.push(e);
        this.reportService.selectedProjects$.next(this.selectedProjects);
        this.tabIndex.emit(3);
    }

    openDialogExtend(e: Campaign) {
        const dialogRef = this.dialogService.open(DialogExtendComponent, {
            header: this.translate.instant('Extend'),
            data: e,
            width: '350px'
        });

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getProjects();
                }
            }
        })
    }

    sortCustomer(e: SortEvent) {
        this.sort = {};
        if (e.order === 1) {
            this.sort[e.field] = 'DESC';
        } else {
            this.sort[e.field] = 'ASC';
        }
        this.getProjects();
    }

}
