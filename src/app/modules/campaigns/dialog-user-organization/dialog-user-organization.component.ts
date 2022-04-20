import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { User } from 'src/app/core/models/user.model';
import { CustomerService } from 'src/app/core/services/customer.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { UserOrganizationService } from 'src/app/core/services/user-organization.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-user-organization',
    templateUrl: './dialog-user-organization.component.html',
    styleUrls: ['./dialog-user-organization.component.scss']
})
export class DialogUserOrganizationComponent extends BaseClass implements OnInit {

    customers: User[] = [];
    selectedCustomers: User[] = []
    dialogData = {
        member: [],
        owner: 0
    };
    actions: number[] = [];
    isLoading: boolean = false;

    constructor(
        private customerService: CustomerService,
        private config: DynamicDialogConfig,
        private userOrganizationService: UserOrganizationService,
        private messageConfig: MessageConfigService,
        private translate: TranslateService,
        private userService: UserService,
        private organizationService: OrganizationService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        if (this.config.data?.organizationId) {
            this.dialogData.member = this.config.data.users.map(e => e.userId);
            this.dialogData.owner = this.config.data.users.find(e => e.isOwner)?.userId;
            this.selectedCustomers = this.dialogData.member;
        }

        this.isLoading = true;
        this.customerService.getCustomers({ page: 1, limit: 99999 })
            .pipe(
                this.unsubsribeOnDestroy,
                finalize(() => {
                    this.isLoading = false;
                }))
            .subscribe({
                next: (res: ApiPagingResult<User[]>) => {
                    this.customers = res.data.records.map(e => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        }
                    });
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

    changeOwner(e: number) {
        const param = {
            organizationId: this.config.data.organizationId,
            customerId: e,
            isOwner: true,
        }
        this.isLoading = true;
        this.userOrganizationService.updateOwner(param)
            .pipe(
                this.unsubsribeOnDestroy,
                finalize(() => {
                    this.isLoading = false;
                }))
            .subscribe({
                next: (res) => {
                    this.messageConfig.messageConfig.next({
                        severity: MESSAGE_TYPE.success,
                        summary: this.translate.instant(MESSAGE_SUMARY.success),
                        detail: this.translate.instant('Update_owner_successfully'),
                    });
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

    changeHandler(e) {
        this.isLoading = true;
        if (this.selectedCustomers.includes(e.itemValue)) {
            const param = {
                organizationId: this.config.data.organizationId,
                customerId: e.itemValue,
            }
            this.userOrganizationService.delete(param)
                .pipe(this.unsubsribeOnDestroy,
                    finalize(() => {
                        this.isLoading = false;
                    }))
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant(res.data.message),
                        });
                        this.reloadDetail();
                    },
                    error: (err) => {
                        this.messageConfig.messageConfig.next({
                            severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                            summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                            detail: err.error?.message ?? this.translate.instant('Internal_server'),
                        })
                    }
                })
        } else {
            const param = {
                organizationId: this.config.data.organizationId,
                userId: e.itemValue,
                isOwner: false,
            }
            this.userOrganizationService.create(param)
                .pipe(this.unsubsribeOnDestroy,
                    finalize(() => {
                        this.isLoading = false;
                    }))
                .subscribe({
                    next: (res) => {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Add_customer_to_organization_successfully'),
                        });
                        this.reloadDetail();
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

    reloadDetail() {
        this.isLoading = true;
        this.organizationService.getOrganizationDetail(this.config.data?.organizationId)
            .pipe(this.unsubsribeOnDestroy,
                finalize(() => {
                    this.isLoading = false;
                }))
            .subscribe({
                next: (res) => {
                    this.dialogData.member = res.data.users.map(e => e.userId);
                    this.dialogData.owner = res.data.users.find(e => e.isOwner)?.userId;
                    this.selectedCustomers = this.dialogData.member;
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
