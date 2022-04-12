import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign/campaign.component';
import { CustomerComponent } from './customer/customer.component';
import { ProjectComponent } from './project/project.component';
import { CampaignAdComponent } from './campaign-ad/campaign-ad.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPrimeModule } from 'src/app/shared/primeng.module';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { CampaignFilterComponent } from './campaign-filter/campaign-filter.component';
import { DialogCustomerComponent } from './dialog-customer/dialog-customer.component';
import { DialogProjectComponent } from './dialog-project/dialog-project.component';
import { DialogCampaignServiceComponent } from './dialog-campaign-service/dialog-campaign-service.component';
import { OrganizationComponent } from './organization/organization.component';
import { DialogOrganizationComponent } from './dialog-organization/dialog-organization.component';
import { DialogUserOrganizationComponent } from './dialog-user-organization/dialog-user-organization.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogOrtherServiceComponent } from './dialog-orther-service/dialog-orther-service.component';

const campaignRoutes: Routes = [
    { path: '', component: CampaignComponent },
]

@NgModule({
    declarations: [
        CampaignComponent,
        CustomerComponent,
        ProjectComponent,
        CampaignAdComponent,
        CampaignFilterComponent,
        DialogCustomerComponent,
        DialogProjectComponent,
        DialogCampaignServiceComponent,
        OrganizationComponent,
        DialogOrganizationComponent,
        DialogUserOrganizationComponent,
        DialogOrtherServiceComponent
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(campaignRoutes),
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
    exports: [],
    providers: [],
})
export class CampaignModule { }
