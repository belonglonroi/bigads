import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogCategoryComponent } from '../dialog-category/dialog-category.component';

@Component({
    selector: 'app-list-category',
    templateUrl: './list-category.component.html',
    styleUrls: ['./list-category.component.scss'],
    providers: [DialogService]
})
export class ListCategoryComponent extends BaseClass implements OnInit {

    categories: Category[] = [];
    filter = {
        name: '',
        page: this.page,
        limit: this.limit,
    }
    fetchingData: boolean = false;
    actions: number[] = [];
    constructor(
        private categoryService: CategoryService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private dialog: DialogService,
        private userService: UserService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action;
        this.getCategories();
    }

    getCategories() {
        this.fetchingData = true;
        this.categoryService.getCategories(this.filter)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Category[]>) => {
                    this.fetchingData = false;
                    this.categories = res.data.records;
                    this.totalRecords = res.data.total;
                }
            })
    }

    openDialog(e?) {
        const dialogRef = this.dialog.open(DialogCategoryComponent, {
            header: e ? this.translate.instant('Update_category') : this.translate.instant('Add_category'),
            data: e,
            width: '350px'
        })

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getCategories();
                }
            }
        })
    }

    delete(e: Category) {
        this.categoryService.deleteCategory(e.categoryId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(MESSAGE_SUMARY.success),
                            detail: res.data.message,
                        });
                        this.getCategories();
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

    changePage(e) {
        this.limit = e.rows;
        this.page = e.page + 1;
        this.getCategories();
    }

    searchByName(e: string) {
        this.filter.name = e;
        this.getCategories();
    }

}
