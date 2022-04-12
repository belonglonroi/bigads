import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { CUSTOMER_TYPE } from 'src/app/core/consts/customer-type.const';
import { GENDER_SELECT } from 'src/app/core/consts/gender.const';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiResult } from 'src/app/core/models/api-result.model';
import { ListUserResult, User } from 'src/app/core/models/user.model';
import { CustomerService } from 'src/app/core/services/customer.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-customer',
    templateUrl: './dialog-customer.component.html',
    styleUrls: ['./dialog-customer.component.scss']
})
export class DialogCustomerComponent extends BaseClass implements OnInit {

    dialogData = {
        lastName: '',
        firstName: '',
        phone: '',
        email: '',
        genderId: 0,
        customerType: 0,
        feeRate: null,
        businessStaffId: 0
    }
    required: string[] = ['lastName', 'firstName', 'phone', 'genderId', 'customerType', 'businessStaffId']
    invalid: boolean = false;
    gender = GENDER_SELECT.map(e => {
        return {
            ...e,
            label: this.translate.instant(e.label)
        }
    });
    customerType = CUSTOMER_TYPE.map(e => {
        return {
            ...e,
            label: this.translate.instant(e.label)
        }
    })
    employees: User[] = [];
    constructor(
        private translate: TranslateService,
        public dialogRef: DynamicDialogRef,
        private userService: UserService,
        public dialogConfig: DynamicDialogConfig,
        private customerService: CustomerService,
        private messageConfig: MessageConfigService,
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.dialogConfig.data?.userId) {
            this.dialogData = {
                lastName: this.dialogConfig.data.lastName,
                firstName: this.dialogConfig.data.firstName,
                phone: this.dialogConfig.data.phone,
                email: this.dialogConfig.data.email,
                genderId: this.dialogConfig.data.genderId,
                customerType: this.dialogConfig.data.customerType,
                feeRate: this.dialogConfig.data.feeRate * 100,
                businessStaffId: this.dialogConfig.data.businessStaff?.userId
            }
        }
        this.userService.getListUser({ limit: 9999, page: 1 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiResult<ListUserResult>) => {
                    this.employees = res.data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName
                        }
                    })
                }
            })
    }

    create() {
        for (const key in this.dialogData) {
            if (!this.dialogData[key] && this.required.includes(key)) {
                this.invalid = true;
                return;
            }
        }
        this.dialogData.feeRate = this.dialogData.feeRate / 100;
        this.customerService.createCustomer(this.dialogData)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Create_customer_successfully'),
                        });

                        this.dialogRef.close(true);
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

    update() {
        for (const key in this.dialogData) {
            if (!this.dialogData[key] && this.required.includes(key)) {
                this.invalid = true;
                return;
            }
        }

        const param = {
            ...this.dialogData,
            customerId: this.dialogConfig.data.userId,
            feeRate: this.dialogData.feeRate / 100,
        }

        this.customerService.updateCustomer(param)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: this.translate.instant('Update_customer_successfully'),
                        });

                        this.dialogRef.close(true);
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

}
