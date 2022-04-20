import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BaseClass } from 'src/app/core/base/base.class';
import { CampaignAds } from 'src/app/core/models/campaign-ads.model';
import { ReportService } from 'src/app/core/services/report.service';
import * as moment from 'moment';
import { User } from 'src/app/core/models/user.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { CampaignFilter } from 'src/app/core/models/campaign-filter.model';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogCampaignServiceComponent } from '../dialog-campaign-service/dialog-campaign-service.component';
import { CampaignServicesService } from 'src/app/core/services/campaign-services.service';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { CampaignService } from 'src/app/core/models/campaign-services.model';
import { DialogOrtherServiceComponent } from '../dialog-orther-service/dialog-orther-service.component';

@Component({
    selector: 'app-campaign-ad',
    templateUrl: './campaign-ad.component.html',
    styleUrls: ['./campaign-ad.component.scss'],
    providers: [ConfirmationService, DialogService]
})
export class CampaignAdComponent extends BaseClass implements OnInit, OnChanges {

    @Input() customerName: string;
    campaignAds: CampaignAds[] = [];
    fetchingData: boolean = false;
    selectedCampaignAds: CampaignService[] = []
    total = {
        avgAmountPer: 0,
        totalAmount: 0,
        totalResult: 0,
        totalAnotherServiceFee: 0,
    }
    campaignFilter: CampaignFilter = {};
    constructor(
        private reportService: ReportService,
        private confirmationService: ConfirmationService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private dialogService: DialogService,
        private campaignServicesService: CampaignServicesService,
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['customerName']) {
            this.reportService.campaignFilter$.value.customerNameStr = changes['customerName'].currentValue;
            this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
        }
    }

    ngOnInit(): void {
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

        this.reportService.selectedProjects$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: Campaign[]) => {
                    this.reportService.campaignFilter$.value.projectIds = res.map(e => e.project.projectId).toString();
                    this.reportService.campaignFilter$.next(this.reportService.campaignFilter$.value);
                }
            })


        this.reportService.campaignFilter$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.campaignFilter = { ...res };
                    this.getCampaignAds();
                }
            })

        this.reportService.selectedCampaignAds$.asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.selectedCampaignAds = res;
                }
            });
    }

    getCampaignAds() {
        this.fetchingData = true;
        this.campaignFilter.page = this.page;
        this.campaignFilter.limit = this.limit;

        this.reportService.getCampaignAds(this.campaignFilter)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.fetchingData = false;
                    this.total = { ...res.data.statistical };
                    this.totalRecords = res.data.total;
                    this.transferData(res.data.records);
                }
            })
    }

    transferData(data: CampaignService[]) {
        this.campaignAds = data.map(e => {
            return {
                ...e,
                customerName: e.campaign.customer.lastName + ' ' + e.campaign.customer.firstName,
                project: e.campaign.project.name,
                serviceName: e.service.serviceName,
                hotline: e.campaign.hotline,
                startDate: moment(e.startDate).format('DD/MM/YYYY'),
                endDate: e.endDate ? moment(e.endDate).format('DD/MM/YYYY') : '',
                adStaffName: e.adStaff ? (e.adStaff.lastName + ' ' + e.adStaff.firstName) : '',
                planningStaffName: e.planningStaff ? (e.planningStaff.lastName + ' ' + e.planningStaff.firstName) : '',
                contentStaffName: e.contentStaff ? (e.contentStaff.lastName + ' ' + e.contentStaff.firstName) : '',
                costPerResult: e.campaignAdsIndex.cpr,
                result: e.campaignAdsIndex.result,
                amount: e.campaignAdsIndex.amount
            }
        })
    }

    selectionChange() {
        this.reportService.selectedCampaignAds$.next(this.selectedCampaignAds);
    }

    changePage(e) {
        this.page = e.page + 1;
        this.getCampaignAds();
    }

    openDialog(e?, method?) {
        const dialogRef = this.dialogService.open(DialogCampaignServiceComponent, {
            header: method ? this.translate.instant('Detail_campaign') : (!e ? this.translate.instant('Add_campaign') : this.translate.instant('Update_campaign')),
            width: '450px',
            data: {
                ...e,
                method
            },
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getCampaignAds();
                }
            }
        })
    }

    openDialogHandler(e: CampaignService) {
        if (e.service.serviceTypeId == 2) {
            this.openDialogOtherService(e);
        } else {
            this.openDialog(e);
        }
    }

    openDialogOtherService(e?, method?) {
        const dialogRef = this.dialogService.open(DialogOrtherServiceComponent, {
            header: !e ? this.translate.instant('Add_other_service') : this.translate.instant('Update_other_service'),
            width: '450px',
            data: {
                ...e,
                method: method,
            }
        });

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getCampaignAds();
                }
            }
        })
    }

    toggleState(item, e) {
        const param = {
            campaignServiceId: item.campaignServiceId,
            isActive: e.checked,
        }

        this.campaignServicesService.toggleStateCampaignService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getCampaignAds();
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    })
                    this.getCampaignAds();
                }
            })
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
        const ids = this.selectedCampaignAds.map((e) => e.campaignServiceId);
        const param = { campaignServiceIds: ids.toString() };
        this.campaignServicesService.deleteCampaignService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.selectedCampaignAds = [];
                        this.getCampaignAds();
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

    delete(e: CampaignService) {
        const param = { campaignServiceIds: e.campaignServiceId.toString() };

        this.campaignServicesService.deleteCampaignService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.selectedCampaignAds = [];
                        this.getCampaignAds();
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

}
