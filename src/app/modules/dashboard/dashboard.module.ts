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
import { ChartModule } from 'angular-highcharts';
import { CompareProjectsComponent } from './compare-projects/compare-projects.component';
import { CompareCategoriesComponent } from './compare-categories/compare-categories.component';
import { CompareEmployeesComponent } from './compare-employees/compare-employees.component';


import * as Highcharts from 'highcharts';
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsExporting from "highcharts/modules/exporting";
import Variablepie from "highcharts/modules/variable-pie";
import Drilldown from 'highcharts/modules/drilldown';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
Drilldown(Highcharts);
Variablepie(Highcharts);

const dashboardRoutes: Routes = [{ path: '', component: AnalysisComponent }];

@NgModule({
    declarations: [StatComponent, AnalysisComponent, CompareProjectsComponent, CompareCategoriesComponent, CompareEmployeesComponent],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(dashboardRoutes),
        SharedModule,
        ReactiveFormsModule,
        ChartModule,
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
