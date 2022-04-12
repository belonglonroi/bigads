import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPrimeModule } from 'src/app/shared/primeng.module';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { ListComponent } from './list/list.component';
import { DialogCampaignAdComponent } from './dialog-campaign-ad/dialog-campaign-ad.component';
import { SharedModule } from 'src/app/shared/shared.module';

const campaignServiceRoutes: Routes = [
    { path: '', component: ListComponent }
]

@NgModule({
    declarations: [
        ListComponent,
        DialogCampaignAdComponent
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(campaignServiceRoutes),
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
export class CampaignServicesModule { }
