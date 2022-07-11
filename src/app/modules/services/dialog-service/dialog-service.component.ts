import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';
import { AdService } from 'src/app/core/models/ad-service.model';
import {
    ApiPagingResult,
    ApiResult,
} from 'src/app/core/models/api-result.model';
import { AdServiceService } from 'src/app/core/services/service.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-service',
    templateUrl: './dialog-service.component.html',
    styleUrls: ['./dialog-service.component.scss'],
})
export class DialogServiceComponent extends BaseClass implements OnInit {
    dialogData = {
        serviceName: '',
        description: '',
        parentId: null,
        isActive: true,
        serviceTypeId: 0,
        taxRate: 0,
    };
    services: AdService[] = [];
    invalid: boolean = false;
    serviceType = [
        { value: 1, label: this.translate.instant('Ad_service') },
        { value: 2, label: this.translate.instant('Other_service') },
    ];

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private adService: AdServiceService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.config.data) {
            console.log(this.config.data);
            this.dialogData = {
                ...this.config.data,
                serviceTypeId: parseInt(this.config.data.serviceTypeId),
                taxRate: this.config.data.taxRate * 100,
            };
        }

        this.getServices();
    }

    getServices() {
        this.adService
            .getService({ page: 1, limit: 9999 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<AdService[]>) => {
                    this.services = res.data.records;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    create() {
        if (!this.dialogData.serviceName) {
            this.invalid = true;
            return;
        }
        this.invalid = false;

        this.dialogData.taxRate = this.dialogData.taxRate / 100;

        this.adService
            .createService(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: this.translate.instant(
                                'Create_service_successfully'
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
        if (!this.dialogData.serviceName) {
            this.invalid = true;
            return;
        }

        this.invalid = false;

        const param = {
            ...this.dialogData,
            sericeId: this.config.data.serviceId,
            taxRate: this.dialogData.taxRate / 100,
        };

        this.adService
            .updateService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: this.translate.instant(
                                'Update_service_successfully'
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
}
