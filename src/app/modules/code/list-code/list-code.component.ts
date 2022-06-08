import { BaseClass } from 'src/app/core/base/base.class';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { GenCodeComponent } from '../gen-code/gen-code.component';
import { TranslateService } from '@ngx-translate/core';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { User } from 'src/app/core/models/user.model';
import { CodeService } from 'src/app/core/services/code.service';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { Code } from 'src/app/core/models/code.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-list-code',
    templateUrl: './list-code.component.html',
    styleUrls: ['./list-code.component.scss'],
    providers: [DialogService]
})
export class ListCodeComponent extends BaseClass implements OnInit {

    name: string = '';
    codes: Code[] = [];
    fetchingData: boolean = false;
    constructor(
        private dialog: DialogService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private customerService: CustomerService,
        private codeService: CodeService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getListCode();
    }

    getListCode() {
        this.fetchingData = true;
        this.codeService.getListCode({ limit: this.limit, page: this.page, code: this.name })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs: ApiPagingResult<Code[]>) => {
                    this.codes = rs.data.records;
                    this.totalRecords = rs.data.total
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.error,
                        summary: this.translate.instant(MESSAGE_SUMARY.error),
                        detail: this.translate.instant('Internal_server'),
                    })
                },
                complete: () => {
                    this.fetchingData = false;
                }
            })
    }

    searchByName(e: string) {
        this.name = e;
        this.getListCode();
    }

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getListCode();
    }

    openDialog(e?) {
        const dialogRef = this.dialog.open(GenCodeComponent, {
            header: e ? this.translate.instant('Update_code') : this.translate.instant('Add_code'),
            data: e,
            width: '450px'
        })

        dialogRef.onClose.subscribe({
            next: rs => {
                if (rs) {
                    this.getListCode();
                }
            }
        })
    }

    copyCode(e: Code) {
        return `${environment.baseUrl}/customer-view?code=${e.code}`;
    }

    delete(e: Code) {
        this.codeService.deleteCode(e.codeId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (rs) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: rs.data.message,
                    });
                    this.getListCode();
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
