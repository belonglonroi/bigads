import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { BaseClass } from 'src/app/core/base/base.class';
import { AdService } from 'src/app/core/models/ad-service.model';
import { ApiPagingResult, ApiResult } from 'src/app/core/models/api-result.model';
import { AdServiceService } from 'src/app/core/services/service.service';
import { DialogService } from 'primeng/dynamicdialog';
import * as moment from 'moment';
import { DialogServiceComponent } from '../dialog-service/dialog-service.component';
import { TranslateService } from '@ngx-translate/core';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-list-service',
    templateUrl: './list-service.component.html',
    styleUrls: ['./list-service.component.scss'],
    providers: [DialogService],
})
export class ListServiceComponent extends BaseClass implements OnInit {

    services = [];
    fetchingData: boolean = false;
    actions: number[] = [];
    constructor(
        private adService: AdServiceService,
        private dialogService: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private userService: UserService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.getServices();
    }

    getServices() {
        this.fetchingData = true;
        this.adService.getService({ limit: this.limit, page: this.page })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<AdService[]>) => {
                    this.totalRecords = res.data.total;
                    this.services = res.data.records.map(e => {
                        return {
                            data: {
                                ...e,
                                createdName: e.createdBy.lastName + ' ' + e.createdBy.firstName,
                                createdDate: moment(e.createdUtcDate).format('DD/MM/YYYY'),
                                modifiedDate: moment(e.modifiedUtcDate).format('DD/MM/YYYY')
                            },
                            children: e.childrenService.map(x => {
                                return {
                                    data: {
                                        ...x,
                                        createdName: x.createdBy.lastName + ' ' + x.createdBy.firstName,
                                        createdDate: moment(x.createdUtcDate).format('DD/MM/YYYY'),
                                        modifiedDate: moment(x.modifiedUtcDate).format('DD/MM/YYYY')
                                    },
                                    children: x.childrenService,
                                }
                            })
                        }
                    });
                    this.fetchingData = false;
                },
                error: (err) => {

                }
            });
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getServices();
    }

    openDialog(e?: AdService) {
        const dialogRef = this.dialogService.open(DialogServiceComponent, {
            header: !e ? this.translate.instant('Add_service') : this.translate.instant('Update_service'),
            width: '350px',
            data: e
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getServices();
                }
            }
        })
    }

    delete(e: AdService) {
        this.adService.deleteService(e.serviceId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getServices();
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

    toggleState(item: AdService, e) {
        const param = {
            serviceId: item.serviceId,
            isActive: e.checked
        }

        this.adService.activeService(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getServices();
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    })
                    this.getServices();
                }
            })
    }

}
