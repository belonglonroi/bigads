import { ConfirmationService } from 'primeng/api';
import { Component, HostListener, OnInit } from '@angular/core';
import { BaseClass } from 'src/app/core/base/base.class';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { CampaignService } from 'src/app/core/models/campaign-services.model';
import { CampaignServicesService } from 'src/app/core/services/campaign-services.service';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogCampaignAdComponent } from '../dialog-campaign-ad/dialog-campaign-ad.component';
import { CampaignAdsService } from 'src/app/core/services/campaign-ads.service';
import { CampaignAds } from 'src/app/core/models/campaign-ads.model';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';
import { CampaignComponent } from '../../campaigns/campaign/campaign.component';
import { Router } from '@angular/router';
import { CampaignService as CampService } from 'src/app/core/services/campaign.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [DialogService, ConfirmationService],
})
export class ListComponent extends BaseClass implements OnInit {
    campaignAds: CampaignService[] = [];
    recordsHasChanged: CampaignService[] = [];
    fetchingData: boolean = false;
    overlayUpdate = {
        amount: 0,
        result: 0,
    };
    itemUpdate: CampaignAds;
    today: Date = new Date();
    dateFilter: Date = new Date(new Date().setDate(new Date().getDate() - 1));
    isUpdate: boolean = false;
    hotline: string = '';

    constructor(
        private campaignServicesService: CampaignServicesService,
        private dialogSerive: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private campaignAdsService: CampaignAdsService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private campaignService: CampService
    ) {
        super();
    }

    // @HostListener('window:beforeunload', ['$event'])
    // beforeunloadHandler(event) {
    //     // if (!this.recordsHasChanged.length) {
    //     //     return true;
    //     // } else {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure that you want to perform this action?',
    //         accept: () => {
    //             this.recordsHasChanged = [];
    //         }
    //     });
    //     // }
    //     return false;
    // }

    ngOnInit(): void {
        this.getCampaignServices();
    }

    dateFilterChange() {
        this.recordsHasChanged = [];
        this.getCampaignServices();
    }

    clearDate() {
        this.dateFilter = null;
    }

    getCampaignServices() {
        this.fetchingData = true;
        const param = {
            page: this.page,
            limit: this.limit,
            isActive: true,
            hotline: this.hotline,
            inputDate: moment(this.dateFilter).format('YYYY-MM-DD'),
        };
        this.campaignServicesService
            .getCampaignServices(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<CampaignService[]>) => {
                    this.fetchingData = false;
                    this.totalRecords = res.data.total;
                    this.transformData(res.data.records);
                },
                error: (err) => {},
            });
    }

    transformData(data: CampaignService[]) {
        this.campaignAds = data.map((e) => {
            return {
                ...e,
                customerName: `${e.campaign.customer?.lastName ?? ''} ${
                    e.campaign.customer?.firstName ?? ''
                }`,
                project: e.campaign.project?.name,
                serviceName: e.service.serviceName,
                hotline: e.campaign.hotline,
                startDate: moment(e.startDate).format('DD/MM/YYYY'),
                endDate: moment(e.endDate).format('DD/MM/YYYY'),
                adStaffName: e.adStaff?.lastName + ' ' + e.adStaff?.firstName,
                planningStaffName:
                    e.planningStaff?.lastName +
                    ' ' +
                    e.planningStaff?.firstName,
                contentStaffName:
                    e.contentStaff?.lastName + ' ' + e.contentStaff?.firstName,
                note: e.campaign.description,
                campaignAdsIndex: {
                    ...e.campaignAdsIndex,
                    result:
                        e.campaignAdsIndex.result === 0
                            ? null
                            : e.campaignAdsIndex.result,
                    amount:
                        e.campaignAdsIndex.amount === 0
                            ? null
                            : e.campaignAdsIndex.amount,
                },
            };
        });
    }

    changeState(e, item: CampaignService) {
        const param = {
            campaignServiceId: item.campaignServiceId,
            isActive: e.checked,
        };

        this.campaignServicesService
            .toggleStateCampaignService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: res.data.message,
                        });
                        this.getCampaignServices();
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
                    this.getCampaignServices();
                },
            });
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getCampaignServices();
    }

    openDialog(e?) {
        const dialogRef = this.dialogSerive.open(DialogCampaignAdComponent, {
            width: '450px',
            header: e
                ? this.translate.instant('Update_campaign_service')
                : this.translate.instant('Create_campaign_service'),
            data: e,
        });

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getCampaignServices();
                }
            },
        });
    }

    updateCost(e: CampaignService) {
        this.isUpdate = true;
        const param = {
            campaignAds: this.recordsHasChanged.map((x) => {
                return {
                    campaignServiceId: x.campaignServiceId,
                    inputDate: moment(this.dateFilter).format('YYYY-MM-DD'),
                    ...x.campaignAdsIndex,
                };
            }),
        };

        this.campaignAdsService
            .createCampaignAds(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant(
                            'Update_cost_successfully'
                        ),
                    });
                    this.recordsHasChanged = [];
                    this.getCampaignServices();
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
                complete: () => {
                    this.isUpdate = false;
                },
            });
    }

    delete(e: CampaignAds) {
        this.campaignServicesService
            .deleteCampaignService(e.campaignAdId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: res.data.message,
                        });
                        this.getCampaignServices();
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

    changeResult(item: CampaignService) {
        if (
            this.recordsHasChanged.find(
                (e) => e.campaignServiceId === item.campaignServiceId
            )
        ) {
            this.recordsHasChanged.find(
                (e) => e.campaignServiceId === item.campaignServiceId
            ).campaignAdsIndex.result = item.campaignAdsIndex.result;
        } else {
            this.recordsHasChanged.push(item);
        }
    }

    changeAmount(item: CampaignService) {
        if (
            this.recordsHasChanged.find(
                (e) => e.campaignServiceId === item.campaignServiceId
            )
        ) {
            this.recordsHasChanged.find(
                (e) => e.campaignServiceId === item.campaignServiceId
            ).campaignAdsIndex.amount = item.campaignAdsIndex.amount;
        } else {
            this.recordsHasChanged.push(item);
        }
    }

    pasteHandle(e: ClipboardEvent, item: CampaignService, field: string) {
        e.preventDefault();
        const clipboardEvent = e.clipboardData;
        let value = clipboardEvent.getData('text');
        value = value.replace(/\D/g, '');
        item.campaignAdsIndex[field] = parseInt(value);
        this.changeAmount(item);
    }

    redirectToCampaign() {
        this.router.navigateByUrl('campaigns');
        this.campaignService.tab$.next(3);
    }

    getColor(e: string) {
        let color = 'unset';
        if (e === 'Kém' || e === 'Rất kém') {
            color = 'red';
        } else if (e === 'Đạt yêu cầu') {
            color = 'blue';
        } else if (e === 'Tốt' || e === 'Xuất sắc') {
            color = 'green';
        }
        return color;
    }

    searchByHotline(e) {
        this.hotline = e;
        this.getCampaignServices();
    }
}
