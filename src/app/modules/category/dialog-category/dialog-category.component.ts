import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { CategoryService } from 'src/app/core/services/category.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-category',
    templateUrl: './dialog-category.component.html',
    styleUrls: ['./dialog-category.component.scss']
})
export class DialogCategoryComponent extends BaseClass implements OnInit {

    dialogData = {
        name: '',
        description: ''
    }
    invalid: boolean = false;

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private categoryService: CategoryService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.config.data) {
            this.dialogData = { ...this.config.data }
        }
    }

    create() {
        if (this.dialogData.name) {
            this.categoryService.createCategory(this.dialogData)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        if (res.data) {
                            this.messageConfig.messageConfig.next({
                                severity: MESSAGE_TYPE.success,
                                summary: this.translate.instant(MESSAGE_SUMARY.success),
                                detail: this.translate.instant('Create_category_successfully'),
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
        } else {
            this.invalid = true;
        }
    }

    update() {
        if (this.dialogData.name) {
            this.categoryService.updateCategory(this.dialogData)
                .pipe(this.unsubsribeOnDestroy)
                .subscribe({
                    next: (res) => {
                        if (res.data) {
                            this.messageConfig.messageConfig.next({
                                severity: MESSAGE_TYPE.success,
                                summary: this.translate.instant(MESSAGE_SUMARY.success),
                                detail: this.translate.instant('Update_category_successfully'),
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
        } else {
            this.invalid = true;
        }
    }


}
