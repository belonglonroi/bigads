import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { TabProjectService } from 'src/app/core/services/tab-project.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';

@Component({
    selector: 'app-dialog-extend',
    templateUrl: './dialog-extend.component.html',
    styleUrls: ['./dialog-extend.component.scss']
})
export class DialogExtendComponent extends BaseClass implements OnInit {

    dialogData = {
        campaignId: 0,
        fixedAmount: 0,
        startDate: ''
    }
    startDate = new Date();
    invalid: boolean = false;

    constructor(
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private tabProjectService: TabProjectService,
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.dialogConfig.data) {
            this.dialogData = {
                campaignId: this.dialogConfig.data.campaignId,
                fixedAmount: this.dialogConfig.data.fixedAmount,
                startDate: '',
            }
        }
    }

    submit() {
        if (!this.startDate || !this.dialogData.fixedAmount) {
            this.invalid = true;
            return;
        }

        this.invalid = false;

        this.dialogData.startDate = moment(this.startDate).format('YYYY/MM/DD')

        this.tabProjectService.extendProject(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: res.data.message,
                    });
                    this.dialogRef.close(true);
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
