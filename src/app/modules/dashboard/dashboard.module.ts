import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { httpTranslateLoader } from 'src/assets/i18n/util';

import { StatComponent } from './stat/stat.component';
import { AnalysisComponent } from './analysis/analysis.component';

const dashboardRoutes: Routes = [{ path: '', component: AnalysisComponent }];

@NgModule({
    declarations: [StatComponent, AnalysisComponent],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(dashboardRoutes),
        SharedModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
})
export class DashboardModule {}
