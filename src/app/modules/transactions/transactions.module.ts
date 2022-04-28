import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { httpTranslateLoader } from 'src/assets/i18n/util';
import { DialogTransactionComponent } from './dialog-transaction/dialog-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';

const transactionRoutes: Routes = [
    { path: '', component: ListTransactionComponent }
]

@NgModule({
    declarations: [
        ListTransactionComponent,
        DialogTransactionComponent,
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(transactionRoutes),
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })],
    exports: [],
    providers: [],
})
export class TransactionsModule { }
