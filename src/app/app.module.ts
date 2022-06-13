import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigComponent } from './app.config.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';

import { MenuService } from './service/app.menu.service';
import { ConfigService } from './service/app.config.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/assets/i18n/util';

import { AuthInterceptor } from './core/auth/auth.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CampaignServicesModule } from './modules/campaign-services/campaign-ad.module';
import { DepartmentModule } from './modules/department/department.module';
import { SharedModule } from './shared/shared.module';
import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey('CompanyName=EVNICT,LicensedGroup=EVNICT,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-021810,ExpiryDate=2_November_2022_[v2]_MTY2NzM0NzIwMDAwMA==8164e6648439d13f314f12022058ac62');

@NgModule({
    imports: [
        PerfectScrollbarModule,
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
        CampaignServicesModule,
        DepartmentModule
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        MenuService,
        ConfigService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
