import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoryComponent } from './list-category/list-category.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPrimeModule } from 'src/app/shared/primeng.module';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { DialogCategoryComponent } from './dialog-category/dialog-category.component';
import { SharedModule } from 'src/app/shared/shared.module';

const categoryRoutes: Routes = [
    { path: '', component: ListCategoryComponent },
]

@NgModule({
    declarations: [
        ListCategoryComponent,
        DialogCategoryComponent,
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(categoryRoutes),
        SharedPrimeModule,
        SharedModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })],
})
export class CategoryModule { }
