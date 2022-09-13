import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerViewComponent } from './view/customer-view.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { SharedModule } from 'src/app/shared/shared.module';

const customerView: Routes = [{ path: '', component: CustomerViewComponent }];

@NgModule({
    declarations: [CustomerViewComponent],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(customerView),
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
})
export class CustomerViewModule {}
