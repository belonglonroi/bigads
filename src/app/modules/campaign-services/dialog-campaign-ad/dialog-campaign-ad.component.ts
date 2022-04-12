import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { CampaignService } from 'src/app/core/models/campaign-services.model';
import { CampaignAdsService } from 'src/app/core/services/campaign-ads.service';
import { CampaignServicesService } from 'src/app/core/services/campaign-services.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import * as moment from 'moment';

@Component({
    selector: 'app-dialog-campaign-ad',
    templateUrl: './dialog-campaign-ad.component.html',
    styleUrls: ['./dialog-campaign-ad.component.scss']
})
export class DialogCampaignAdComponent extends BaseClass implements OnInit {

    dialogData = {
        campaignServiceId: 0,
        adAccount: '',
        amount: 0,
        cpm: 0,
        cpc: 0,
        ctr: 0,
        result: 0,
        view: 0,
        frequency: 0,
        approach: 0,
        message: 0,
        comment: 0,
        click: 0,
        like: 0,
        timeView: 0,
        videoView: 0,
        inputDate: ''
    };
    invalid: boolean = false;
    campaignServices: CampaignService[] = [];

    constructor(
        private campaignServicesService: CampaignServicesService,
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private campaignAdsSerive: CampaignAdsService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.campaignServicesService.getCampaignServices({ page: 1, limit: 99999 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<CampaignService[]>) => {
                    this.campaignServices = res.data.records.map(e => {
                        return {
                            ...e,
                            name: e.campaign.description,
                        };
                    });
                    console.log(this.campaignServices);
                }
            });

        if (this.dialogConfig.data) {
            this.dialogData = {
                ...this.dialogConfig.data,
                inputDate: new Date(this.dialogConfig.data.inputDate)
            };
        }
    }

    create() {
        if (!this.dialogData.campaignServiceId || !this.dialogData.adAccount || !this.dialogData.amount || !this.dialogData.click || !this.dialogData.inputDate) {
            this.invalid = true;
            return;
        }

        for (const key in this.dialogData) {
            if (!this.dialogData[key]) {
                delete this.dialogData[key];
            }
        }

        this.dialogData.inputDate = moment(this.dialogData.inputDate).format('YYYY-MM-DD');

        this.campaignAdsSerive.createCampaignAds(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant('Create_campaign_ads_successfully'),
                    });

                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    });
                }
            });
    }

    update() {
        if (!this.dialogData.campaignServiceId || !this.dialogData.adAccount || !this.dialogData.amount || !this.dialogData.click || !this.dialogData.inputDate) {
            this.invalid = true;
            return;
        }

        for (const key in this.dialogData) {
            if (!this.dialogData[key]) {
                delete this.dialogData[key];
            }
        }

        this.dialogData.inputDate = moment(this.dialogData.inputDate).format('YYYY-MM-DD');

        const param = {
            ...this.dialogData,
            campaignAdId: this.dialogConfig.data.campaignAdId
        }
        this.campaignAdsSerive.updateCampaignAds(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant('Create_campaign_ads_successfully'),
                    });

                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    });
                }
            });
    }

}
