import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-organization',
    templateUrl: './dialog-organization.component.html',
    styleUrls: ['./dialog-organization.component.scss']
})
export class DialogOrganizationComponent extends BaseClass implements OnInit {

    dialogData = {
        organizationName: '',
        fanpage: '',
        website: '',
        address: '',
        description: '',
        isActive: 'true',
        image: '',
        owner: '',
        member: [],
    }
    invalid: boolean = false;

    constructor(
        private organizationService: OrganizationService,
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private translate: TranslateService,
        private messageConfig: MessageConfigService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.dialogConfig.data) {
            this.dialogData = {
                ...this.dialogConfig.data
            }

            if (this.dialogConfig.data.method) {
                const owner = this.dialogConfig.data.users.find(e => e.isOwner);
                this.dialogData.owner = `${owner.lastName} ${owner.firstName}`;
                this.dialogData.member = this.dialogConfig.data.users.map(e => `${e.lastName} ${e.firstName}`);
            }
        }
    }

    create() {
        if (!this.dialogData.organizationName) {
            this.invalid = true;
            return;
        }

        this.invalid = false;

        this.organizationService.createOrganization(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant('Create_organization_successfully'),
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
        if (!this.dialogData.organizationName) {
            this.invalid = true;
            return;
        }

        this.invalid = false;

        const param = {
            ...this.dialogData,
            organizationId: this.dialogConfig.data.organizationId,
            isActive: this.dialogConfig.data.isActive.toString(),
        }
        this.organizationService.updateOrganization(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant('Update_organization_successfully'),
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
