import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { httpTranslateLoader } from 'src/assets/i18n/util';
import { ListServiceComponent } from './list-service/list-service.component';
import { DialogServiceComponent } from './dialog-service/dialog-service.component';
import { SharedModule } from 'src/app/shared/shared.module';

const serviceRoutes: Routes = [
    { path: '', component: ListServiceComponent }
]

@NgModule({
    declarations: [
        ListServiceComponent,
        DialogServiceComponent
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(serviceRoutes),
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ]
})
export class ServiceModule { }
